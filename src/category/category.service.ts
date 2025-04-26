import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CategoryDto } from './dto/category.dto';

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

	async create(dto : CategoryDto) {
		const maxPriority = await this.prisma.category.findFirst({
			orderBy: { priority: 'desc' },
			select: { priority: true },
		});

		const newPriority = maxPriority ? maxPriority.priority + 1 : 0;

		return this.prisma.category.create({
			data: {
				name: dto.name,
				priority: dto.priority || newPriority,
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

	async update(id: string, dto: CategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				priority: dto.priority,
			},
			select: returnCategoryObject,
		});
	}

	async delete(id: string) {
		const deletedCategory = await this.prisma.category.findUnique({
			where: { id },
			select: returnCategoryObject
		});

		if (!deletedCategory) {
			throw new NotFoundException('Category not found');
		}

		await this.prisma.category.delete({
			where: { id }
		});

		return deletedCategory;
	}
}
