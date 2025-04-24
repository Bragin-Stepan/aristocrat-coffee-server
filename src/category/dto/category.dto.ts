import { Role } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class CategoryDto {

	@IsOptional()
	@IsString()
	role: Role

	@IsOptional()
	@IsString()
	name: string
}
