import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { UserFilter } from 'src/helpers/filters/user.filter';
import { UserSorting } from 'src/helpers/sortings/user.sorting';
import { Pagination } from 'src/contracts';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { FilterService } from 'src/helpers/services/filter.service';
import { Role } from '../role/entities/role.entity';
import { UserActivationCode } from './entities/user-activation-code.entity';
import { ConfigService } from '@nestjs/config';
import { addDays, format } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { CreateClientUserDto } from './dto/create-client-user.dto';
import { UserType } from '../../enum/user-type.enum';
import { ActivateClientUserDto } from './dto/activate-client-user.dto';
import { ApiProjectService } from '../../api-service/api-project.service';
import { v4 as uuidv4 } from 'uuid';
import { UserProjectAssignmentDto } from './dto/user-project-assignment.dto';

@Injectable()
export class UserService extends PaginationService {
  constructor(
    @Inject(MailService)
    private readonly mailService: MailService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserActivationCode)
    private readonly userActivationCodeRepository: Repository<UserActivationCode>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly apiProjectService: ApiProjectService,
  ) {
    super();
  }

  async filter(
    filter: UserFilter,
    sorting: UserSorting,
    pagination: Pagination,
    type: string = UserType.metaUser,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.roles', 'roles');

    queryBuilder.andWhere('user.type = (:type)', { type });
    queryBuilder.andWhere('user.isVisible = (:visible)', { visible: true });

    this.applyFilter(queryBuilder, filter);
    this.applySorting(queryBuilder, sorting);

    queryBuilder.addOrderBy('roles.name', 'ASC');

    return await this.paginate(queryBuilder, pagination);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, roles } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('The email address is already in use.');
    }

    const randomPassword = this.generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = this.userRepository.create({
      fullName: name,
      email,
      password: hashedPassword,
      type: UserType.metaUser,
    });

    if (roles && roles.length > 0) {
      const rolesEntities = await this.entityManager
        .createQueryBuilder(Role, 'role')
        .whereInIds(roles)
        .getMany();

      newUser.roles = rolesEntities;
    }

    const user = await this.userRepository.save(newUser);
    const code = await this.addActivationCode(user);
    await this.mailService.createMetaUser(user, code);
    return user;
  }

  async createClientUser(
    token: string,
    dto: CreateClientUserDto,
  ): Promise<User[]> {
    const users: User[] = [];
    const userIdToProject: UserProjectAssignmentDto[] = [];
    try {
      return await this.userRepository.manager.transaction(
        async (manager: EntityManager) => {
          for (const user of dto.users) {
            const existingUser = await manager.getRepository(User).findOne({
              where: { email: user.email },
            });
            const id = existingUser ? existingUser.id : uuidv4();
            if (!existingUser) {
              const newUser = manager.getRepository(User).create({
                id,
                fullName: user.name,
                email: user.email,
                password: '',
                type: UserType.clientUser,
                isVisible: false,
              });
              users.push(newUser);
            }
            userIdToProject.push({ userId: id });
          }
          await this.apiProjectService.assignStakeholderUserToProject(
            token,
            userIdToProject,
            dto.projectId,
          );
          return await manager.getRepository(User).save(users);
        },
      );
    } catch (error) {
      Logger.error(error, 'Error -> Create client users');
      throw new BadRequestException(error);
    }
  }

  async activateClientUser(
    token: string,
    dto: ActivateClientUserDto,
  ): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      existingUser.isVisible = true;
      const user = await this.userRepository.save(existingUser);
      const code = await this.addActivationCode(user);

      const project = await this.apiProjectService.userBelongsToProject(
        token,
        dto.projectId,
      );
      await this.mailService.createClientUser(user, project.logo, code);
      return user;
    } catch (error) {
      Logger.error(error, 'Error -> Activate client users');
      throw new BadRequestException(error);
    }
  }

  async findMe(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const permissions = user.roles.flatMap((role) => role.permissions);

    return {
      user,
      permissions,
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .where('user.id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    const { name, roles } = updateUserDto;

    user.fullName = name;

    const rolesEntities = await this.entityManager
      .createQueryBuilder(Role, 'role')
      .whereInIds(roles)
      .getMany();

    user.roles = rolesEntities;

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const timestamp = new Date().getTime();
    const originalEmail = user.email;

    user.email = `${timestamp}_${originalEmail}`;
    await this.userRepository.save(user);

    await this.userRepository.softRemove(user);
  }

  async changeStatus(id: string, status: string) {
    let newStatus: UserStatus;
    switch (status) {
      case 'activate':
        newStatus = UserStatus.Active;
        break;
      case 'deactivate':
        newStatus = UserStatus.Inactive;
        break;
      default:
        throw new NotFoundException('Invalid status');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = newStatus;

    return this.userRepository.save(user);
  }

  private applyFilter(
    queryBuilder: SelectQueryBuilder<any>,
    filter: UserFilter,
  ): void {
    const { name, email, roles, statuses } = filter;

    if (name) {
      FilterService.applyLikeFilter(queryBuilder, 'user.fullName', name);
    }

    if (email) {
      FilterService.applyLikeFilter(queryBuilder, 'user.email', email);
    }

    if (roles && roles.length > 0) {
      queryBuilder.andWhere('roles.id IN (:...roleIds)', { roleIds: roles });
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere('user.status IN (:...statuses)', { statuses });
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    sorting: UserSorting,
  ): void {
    const { name, createdAt, email, status } = sorting;

    if (name) {
      queryBuilder.addOrderBy('user.fullName', name);
    }

    if (createdAt) {
      queryBuilder.addOrderBy('user.createdAt', createdAt);
    }

    if (email) {
      queryBuilder.addOrderBy('user.email', email);
    }

    if (status) {
      queryBuilder.addOrderBy('user.status', status);
    }
  }

  async addActivationCode(user: User): Promise<string> {
    const activationCode = await this.generateRandomCode(6);

    const expirationDays =
      this.configService.get<number>('ACTIVATION_CODE_EXPIRATION_DAYS') || 15;

    const expirationDate = addDays(new Date(), expirationDays);

    const userActivationCode = this.userActivationCodeRepository.create({
      code: activationCode,
      user: user,
      expirationDate: format(expirationDate, 'yyyy-MM-dd HH:mm:ss'),
    });

    this.userActivationCodeRepository.save(userActivationCode);
    return activationCode;
  }

  async listForProjects(userIds: string[]) {
    let selectedUsers: Array<any> = [];
    let unselectedUsers: Array<any> = [];

    if (userIds.length === 0) {
      unselectedUsers = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.fullName'])
        .andWhere('user.type = :type', { type: UserType.metaUser })
        .getMany();

      return {
        selected: [],
        unselected: unselectedUsers.map((user) => ({
          id: user.id,
          name: user.fullName,
        })),
      };
    }

    selectedUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName'])
      .andWhere('user.id IN (:...userIds)', { userIds })
      .andWhere('user.type = :type', { type: UserType.metaUser })
      .getMany();

    unselectedUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName'])
      .andWhere('user.id NOT IN (:...userIds)', { userIds })
      .andWhere('user.type = :type', { type: UserType.metaUser })
      .getMany();

    return {
      selected: selectedUsers.map((user) => ({
        id: user.id,
        name: user.fullName,
      })),
      unselected: unselectedUsers.map((user) => ({
        id: user.id,
        name: user.fullName,
      })),
    };
  }

  private async generateRandomCode(length: number): Promise<string> {
    const characters = '0123456789';
    let code = '';

    while (true) {
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }

      const existingCode = await this.userActivationCodeRepository.findOne({
        where: { code },
      });

      if (!existingCode) {
        return code;
      }

      code = '';
    }
  }

  private generateRandomPassword(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  async listUsers(emails: string[]) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .andWhere('user.email IN (:...emails)', { emails })
      .getMany();
    return users;
  }
}
