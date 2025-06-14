import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { changeRoleDto } from './dto/change-rule.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@Auth([Role.ADMIN])
	@HttpCode(200)
	@Delete(':id')
	async delete(@CurrentUser('id') id: string) {
		return this.userService.deleteUser(id)
	}

  @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async updateUser(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.updateUser(id, dto)
	}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change')
	@Auth([Role.ADMIN])
  async changeRole(
    @Body() dto: changeRoleDto,
  ) {
    return this.userService.changeUserRole(dto);
  }
}
