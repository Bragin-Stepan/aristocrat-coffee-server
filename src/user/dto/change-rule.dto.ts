import { IsString } from "class-validator";
import { Role } from '@prisma/client';

export class changeRoleDto {

  @IsString()
  userId: string;

  @IsString()
  targetId: string;

  @IsString()
  newRole: Role;
}
