import { Prisma } from '@prisma/client'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string

	@IsNumber()
	variants: Prisma.ProductVariantUpdateManyWithoutProductNestedInput | undefined;

	@IsOptional()
	@IsString()
	description?: string

	@IsString()
	images: string[]

	@IsString()
	categoryId: string
}
