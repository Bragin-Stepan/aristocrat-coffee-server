import { UseGuards, applyDecorators } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from '../guards/roles.guard';

const ROLES_KEY = 'roles';
const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 
 * @param roles
 * @example @Auth([Role.ADMIN])
 */
export const Auth = (
  roles: Role[] = [],
) => {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}
