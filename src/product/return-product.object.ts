import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.object'

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	variants: true,
	createdAt: true,
	order:true,
	category: { select: returnCategoryObject }
}

export const returnProductObjectFullest: Prisma.ProductSelect = {
	...returnProductObject
}
