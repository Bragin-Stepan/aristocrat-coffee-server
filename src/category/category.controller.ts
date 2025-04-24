import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Role, User } from '@prisma/client';
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll();
	}

	@HttpCode(200)
	@Post()
	async create(@Body() user: User, name: string) {
		return this.categoryService.create(user, name);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') id: string, @Body() user: User, name: string) {
		return this.categoryService.update(id, user, name);
	}

	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string, @Body() user: User) {
		return this.categoryService.delete(id, user);
	}

  @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('sort')
	async updateOrder(@Body() ids: string[], user: User) {
		return this.categoryService.updateOrder(ids, user);
	}
}
