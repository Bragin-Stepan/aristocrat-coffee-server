import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.productService.getAll(searchTerm);
	}

	@UsePipes(new ValidationPipe())
	@Get( ':id')
	async getById(@Param('id') id: string) {
		return this.productService.getById(id);
	}

  @Get('by-category/:id')
	async getProductsByCategory(@Param('id') id: string) {
		return this.productService.byCategory(id)
	}


  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @Auth([Role.ADMIN])
  async createProduct(
    @Body() dto: ProductDto,
  ) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  @Auth([Role.ADMIN])
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.update(id, dto);
  }

	@HttpCode(200)
	@Delete(':id')
  @Auth([Role.ADMIN])
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(id)
	}
}
