import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { Role, User } from '@prisma/client';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.category.findMany({
      orderBy: {
        priority: 'asc',
      },
      select: {
        id: true,
        name: true,
        priority: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

	async create(name: string) {
		const maxPriority = await this.prisma.category.findFirst({
			orderBy: { priority: 'desc' },
			select: { priority: true },
		});

		const newPriority = maxPriority ? maxPriority.priority + 1 : 0;

		return this.prisma.category.create({
			data: {
				name: name,
				priority: newPriority,
			},
		});
	}

	async getById(id: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				id,
			},
			select: returnCategoryObject,
		});

		if (!category) throw new Error('Category not found');

		return category;
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
		try {
			await this.prisma.category.delete({
				where: { id },
			});
			return { message: 'Category deleted successfully' };
		} catch (error) {
			if (this.isNotFoundError(error)) {
				throw new NotFoundException('Category not found');
			}
			throw error;
		}
	}

	async updatePriority(dto: UpdatePriorityDto) {
		const { ids } = dto;

		const existingCategories = await this.prisma.category.findMany({
			where: { id: { in: ids } },
		});

		if (existingCategories.length !== ids.length) {
			throw new Error('Some categories do not exist');
		}

		for (let i = 0; i < ids.length; i++) {
			const categoryId = ids[i];
			await this.prisma.category.update({
				where: { id: categoryId },
				data: { priority: i },
			});
		}

		return this.getCategories();
	}

	private isNotFoundError(error: unknown): boolean {
		return (
			error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
		);
	}

	private getCategories() {
		return this.prisma.category.findMany({
			select: returnCategoryObject,
			orderBy: {
				priority: 'asc',
			},
		});
	}
}
