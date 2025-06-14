import { Prisma } from '@prisma/client'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class VariantDto {

	@IsNumber()
	@IsNotEmpty()
	price: number

	@IsString()
	@IsNotEmpty()
	size: string
}

export class ProductDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsArray()
	@IsNotEmpty()
	variants: VariantDto[];

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	components?: string

	@IsArray()
	@IsString({ each: true })
	imagesId: string[]

	@IsString()
	@IsNotEmpty()
	categoryId: string

	@IsOptional()
	@IsNumber()
	priority?: number
}
