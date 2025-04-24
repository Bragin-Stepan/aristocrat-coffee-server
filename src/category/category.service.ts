import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  
	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}

	async create(dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to create categories')

		return this.prisma.category.create({
			data: {
				name: dto.name,
			}
		})
	}

	async update(id: string, dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to update categories')

		return this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name,
			}
		})
	}

	async delete(id: string, dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to delete categories')

		return this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
