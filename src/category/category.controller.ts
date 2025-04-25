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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll();
	}

	@HttpCode(200)
	@Post()
	@Auth([Role.ADMIN])
	async create(@Body('name') name: string) {
		return this.categoryService.create(name);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth([Role.ADMIN])
	async update(@Param('id') id: string, @Body('name') name: string) {
		return this.categoryService.update(id, name);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth([Role.ADMIN])
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('sort')
	@Auth([Role.ADMIN])
	async updateOrder(@Body( 'ids') dto: UpdateOrderDto) {
		return this.categoryService.updateOrder(dto);
	}
}
