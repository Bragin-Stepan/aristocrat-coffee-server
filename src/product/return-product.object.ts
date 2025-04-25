import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.object'

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	components: true,
	id: true,
	name: true,
	variants: true,
	createdAt: true,
	updatedAt: true,
	priority:true,
	category: { select: returnCategoryObject }
}

export const returnProductObjectFullest: Prisma.ProductSelect = {
	...returnProductObject
}
