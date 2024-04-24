import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { UserProjectAssignmentDto } from '../modules/user/dto/user-project-assignment.dto';

@Injectable()
export class ApiProjectService {
  private readonly baseUrl = this.config.get('META_PROJECT_URL');

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async get<T>(
    method: string,
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return await lastValueFrom(
      this.httpService.get<T>(method, config).pipe(map((response) => response)),
    );
  }

  async post<T>(
    method: string,
    dto: T,
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return await lastValueFrom(
      this.httpService
        .post(method, dto, config)
        .pipe(map((response) => response)),
    );
  }

  async assignUserToProject(
    token: string,
    user: string,
    proyectId: string,
  ): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const postData = { userId: user };
    return this.post<any>(
      `${this.baseUrl}/projects/${proyectId}/assign-user`,
      postData,
      config,
    )
      .then((response) => {
        if (response.status === 201) {
          Logger.debug(JSON.stringify(response.data), '[SYNC-USER-PROJECT-OK]');
          return response.data;
        }
        Logger.debug(
          JSON.stringify(response.data),
          '[SYNC-USER-PROJECT-ERROR]',
        );
        throw new HttpException(
          'Api auth error: Invalid status code',
          HttpStatus.BAD_REQUEST,
        );
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Api project error';
        Logger.error(error, 'Error POST api-project');
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      });
  }

  async assignStakeholderUserToProject(
    token: string,
    postData: UserProjectAssignmentDto[],
    proyectId: string,
  ): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    return this.post<UserProjectAssignmentDto[]>(
      `${this.baseUrl}/projects/${proyectId}/assign-stakeholder-user`,
      postData,
      config,
    )
      .then((response) => {
        if (response.status === 201) {
          Logger.debug(JSON.stringify(response.data), '[SYNC-USER-PROJECT-OK]');
          return response.data;
        }
        Logger.debug(
          JSON.stringify(response.data),
          '[SYNC-USER-PROJECT-ERROR]',
        );
        throw new HttpException(
          'Api auth error: Invalid status code',
          HttpStatus.BAD_REQUEST,
        );
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Api project error';
        Logger.error(error, 'Error POST api-project');
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      });
  }

  async userBelongsToProject(token: string, projectId: string): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    return this.get<any>(`${this.baseUrl}/projects/${projectId}`, config)
      .then((response) => {
        if (response.status === 200) {
          Logger.debug(
            JSON.stringify(response.data),
            '[userBelongsToProject-OK]',
          );
          return response.data.data;
        }
        Logger.debug(
          JSON.stringify(response.data),
          '[userBelongsToProject-ERROR]',
        );
        throw new HttpException(
          'Api error: Invalid status code',
          HttpStatus.BAD_REQUEST,
        );
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Api project error';
        Logger.error(error, 'Error Get api-project');
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      });
  }

  async configSettingProject(projectId: string): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {},
    };
    return this.get<any>(
      `${this.baseUrl}/internal-apis/projects/${projectId}/mail-settings`,
      config,
    )
      .then((response) => {
        if (response.status === 200) {
          Logger.debug(
            JSON.stringify(response.data),
            '[configSettingProject-OK]',
          );
          return response.data;
        }
        Logger.debug(
          JSON.stringify(response.data),
          '[configSettingProject-ERROR]',
        );
        throw new HttpException(
          'Api error: Invalid status code',
          HttpStatus.BAD_REQUEST,
        );
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Api project error';
        Logger.error(error, 'Error Get api-project');
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      });
  }
}
