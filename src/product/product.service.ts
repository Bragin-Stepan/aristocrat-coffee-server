import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private categoryService: CategoryService,
		private readonly imagesService: ImagesService,
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

	async create(dto: ProductDto) {

		if (dto.imagesId && dto.imagesId.length > 0) {
			await Promise.all(
				dto.imagesId.map(async imageId => {
					const imageExists = await this.imagesService.getImageById(imageId);
					if (!imageExists) {
						throw new NotFoundException(`Image with ID ${imageId} not found`);
					}
				}),
			);
		}

		return this.prisma.product.create({
			data: {
				name: dto.name,
				description: dto.description ?? '',
				components: dto.components ?? '',
				categoryId: dto.categoryId,
				priority: dto.priority ?? 1,
				images:
					dto.imagesId && dto.imagesId.length > 0
						? { connect: dto.imagesId.map(id => ({ id })) }
						: undefined,
				variants: {
					create: dto.variants.map(variant => ({
						price: variant.price,
						size: variant.size,
					})),
				},
			},
			include: {
				images: true,
				variants: true,
			},
		});
	}

	async update(id: string, dto: ProductDto) {
		const product = await this.getById(id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		await this.categoryService.getById(dto.categoryId);

		if (dto.imagesId && dto.imagesId.length > 0) {
			await Promise.all(
				dto.imagesId.map(async imageId => {
					const imageExists = await this.imagesService.getImageById(imageId);
					if (!imageExists) {
						throw new NotFoundException(`Image with ID ${imageId} not found`);
					}
				}),
			);
		}

		return this.prisma.product.update({
			where: { id },
			data: {
				name: dto.name,
				description: dto.description,
				components: dto.components,
				categoryId: dto.categoryId,
				priority: dto.priority,
				images: {
					set: dto.imagesId.map(id => ({ id })),
				},
				variants: {
					deleteMany: {},
					create: dto.variants.map(variant => ({
						price: variant.price,
						size: variant.size,
					})),
				},
			},
			include: {
				images: true,
				variants: true,
			},
		});
	}

	async delete(id: string) {
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
