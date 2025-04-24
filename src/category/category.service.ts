import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './dto/category.dto';

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


  async create(dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to create categories');

    const maxOrder = await this.prisma.category.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = maxOrder ? maxOrder.order + 1 : 0; 

    return this.prisma.category.create({
      data: {
        name: dto.name,
        order: newOrder,
      },
    });
  }

  async update(id: string, dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to update categories');

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async delete(id: string, dto: CategoryDto) {
    if (dto.role === 'USER') throw new Error('You do not have access to delete categories');

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