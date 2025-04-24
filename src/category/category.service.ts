import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { Role, User } from '@prisma/client';

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject,
			orderBy: {
				order: 'asc',
			},
		});
	}

	async create(name: string) {
		const maxOrder = await this.prisma.category.findFirst({
			orderBy: { order: 'desc' },
			select: { order: true },
		});

		const newOrder = maxOrder ? maxOrder.order + 1 : 0;

		return this.prisma.category.create({
			data: {
				name: name,
				order: newOrder,
			},
		});
	}

	async update(id: string, name: string) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: name,
			},
		});
	}

	async delete(id: string) {
		return this.prisma.category.delete({
			where: { id },
		});
	}

	async updateOrder(ids: string[]) {
		for (let i = 0; i < ids.length; i++) {
			const categoryId = ids[i];
			await this.prisma.category.update({
				where: { id: categoryId },
				data: { order: i },
			});
		}
	}
}
