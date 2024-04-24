import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export class PermissionsGuard implements CanActivate {
  constructor(private requiredPermissions: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user.isAdmin) return true;

    const userPermissions = request.user.roles.flatMap((role: any) =>
      role.permissions.map((perm: any) => perm.name),
    );

    const hasPermission = this.checkPermissions(userPermissions);

    if (!hasPermission) {
      throw new ForbiddenException('Credentials are not valid');
    }
    return true;
  }

  private checkPermissions(userPermissions: string[]): boolean {
    return this.requiredPermissions.some((permission) => {
      const subPermissions = permission.split('||');
      return subPermissions.some((subPermission) => {
        return userPermissions.includes(subPermission);
      });
    });
  }
}
