import { Module } from '@nestjs/common'
import { CategoryModule } from 'src/category/category.module'
import { PrismaService } from 'src/prisma.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ImagesService } from 'src/images/images.service'

@Module({
	controllers: [ProductController],
	imports: [
		CategoryModule],
	providers: [ProductService, PrismaService, ImagesService]
})
export class ProductModule {}
