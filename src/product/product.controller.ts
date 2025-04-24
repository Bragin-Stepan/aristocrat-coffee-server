import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

	// @UsePipes(new ValidationPipe())
	// @Get()
	// async getAll() {
	// 	return this.productService.getAll()
	// }

	// @UsePipes(new ValidationPipe())
	// @HttpCode(200)
	// @Post()
	// async createProduct() {
	// 	return this.productService.create()
	// }

	// @UsePipes(new ValidationPipe())
	// @HttpCode(200)
	// @Put(':id')
	// async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
	// 	return this.productService.update(id, dto)
	// }

	// @HttpCode(200)
	// @Delete(':id')
	// async deleteProduct(@Param('id') id: string) {
	// 	return this.productService.delete(id)
	// }
}
