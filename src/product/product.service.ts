import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private categoryService: CategoryService,
		private filesService: FilesService,
	) {}

	async getAll(searchTerm?: string) {
		if (searchTerm) {
			return this.search(searchTerm);
		}

		return this.prisma.product.findMany({
			select: returnProductObject,
			orderBy: {
				priority: 'desc',
			},
		});
	}

	async getById(id: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: returnProductObject,
		});
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	async search(searchTerm: string) {
		return this.prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
			select: returnProductObject,
		});
	}

	async byCategory(id: string) {
		const category = await this.categoryService.getById(id);
		if (!category) {
			throw new NotFoundException('Category not found');
		}
		return this.prisma.product.findMany({
			where: {
				categoryId: category.id,
			},
			orderBy: {
				priority: 'desc',
			},
			select: returnProductObject,
		});
	}

	async create(dto: ProductDto, images: Express.Multer.File[]) {
		const maxPriority = await this.prisma.product.findFirst({
			orderBy: { priority: 'desc' },
			select: { priority: true },
		});

		const newPriority = maxPriority ? maxPriority.priority + 1 : 0;

		const imageUrls = images
			? await Promise.all(
					images.map(image =>
						this.filesService.uploadFile(image.buffer, image.originalname),
					),
				)
			: [];

		return this.prisma.product.create({
			data: {
				name: dto.name,
				description: dto.description ?? '',
				components: dto.components ?? '',
				images: [...(dto.images || []), ...imageUrls],
				categoryId: dto.categoryId,
				priority: newPriority,
				variants: {
					create: dto.variants.map(variant => ({
						price: variant.price,
						size: variant.size,
					})),
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	}

	async update(id: string, dto: ProductDto, newImages?: Express.Multer.File[]) {
		const { description, images, variants, components, name, categoryId } = dto;

		await this.categoryService.getById(categoryId);

		const newImageUrls = newImages
			? await Promise.all(
					newImages.map(image =>
						this.filesService.uploadFile(image.buffer, image.originalname),
					),
				)
			: [];

		return this.prisma.product.update({
			where: {
				id,
			},
			data: {
				description,
				components,
				images,
				variants: {
					deleteMany: variants,
					create: variants,
				},
				name,
				category: {
					connect: {
						id: categoryId,
					},
				},
			},
		});
	}

	async delete(id: string) {
		const product = await this.prisma.product.findUnique({
      where: { id },
      select: { images: true },
    });

    if (product?.images?.length) {
      await Promise.all(
        product.images.map(url => this.filesService.deleteFile(url)),
      );
    }

    return this.prisma.$transaction(async prisma => {
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      await prisma.product.delete({
        where: { id },
      });
    });
	}
}
