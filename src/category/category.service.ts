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

	async create(user: User, name: string) {
		this.checkRole(user, 'ADMIN');

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

	async update(id: string, user: User, name: string) {
		this.checkRole(user, 'ADMIN');

		return this.prisma.category.update({
			where: { id },
			data: {
				name: name,
			},
		});
	}

	async delete(id: string, user: User) {
		this.checkRole(user, 'ADMIN');

		return this.prisma.category.delete({
			where: { id },
		});
	}

	async updateOrder(ids: string[], user: User) {
		this.checkRole(user, 'ADMIN');

		for (let i = 0; i < ids.length; i++) {
			const categoryId = ids[i];
			await this.prisma.category.update({
				where: { id: categoryId },
				data: { order: i },
			});
		}
	}

  private async checkRole(user: User, role: Role) {
    this.prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (user.role !== role) {
      throw new Error('You do not have permission to perform this action');
    }
  }
}
