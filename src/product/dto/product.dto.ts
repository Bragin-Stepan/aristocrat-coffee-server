import { Prisma } from '@prisma/client'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class VariantDto {

	@IsNumber()
	price: number

	@IsString()
	size: string
}

export class ProductDto {
	@IsString()
	name: string

	@IsArray()
	variants: VariantDto[];

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	components?: string

	@IsArray()
	@IsString({ each: true })
	images: string[]

	@IsString()
	categoryId: string
}
