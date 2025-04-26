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
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { CategoryDto } from './dto/category.dto';
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
	async create(@Body() dto: CategoryDto) {
		return this.categoryService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth([Role.ADMIN])
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(id, dto);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth([Role.ADMIN])
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id);
	}
}
