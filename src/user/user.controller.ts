import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { changeRoleDto } from './dto/change-rule.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async auth(@Body() dto: UserDto) {
		return this.userService.auth(dto);
	}

  @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':id')
  async getUser(@Param('id') id: string) {
		return this.userService.getUser(id);
	}

	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.userService.deleteUser(id)
	}

  @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() dto: UserDto) {
		return this.userService.updateUser(id, dto)
	}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change')
  async changeRole(
    @Body() dto: changeRoleDto,
  ) {
    return this.userService.changeUserRole(dto);
  }
}
