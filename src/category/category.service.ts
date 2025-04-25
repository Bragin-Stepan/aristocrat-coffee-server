import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { Role, User } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

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
      select: returnCategoryObject,
		});
	}

	async delete(id: string) {
		return this.prisma.category.delete({
			where: { id },
		});
	}

	async updateOrder(dto: UpdateOrderDto) {
    const existingCategories = await this.prisma.category.findMany({
      where: { id: { in: dto.ids } },
    });
  
    if (existingCategories.length !== dto.ids.length) {
      throw new Error('Some categories do not exist');
    }
  
    for (let i = 0; i < dto.ids.length; i++) {
      const categoryId = dto.ids[i];
      await this.prisma.category.update({
        where: { id: categoryId },
        data: { order: i },
      });
    }
	}
}
