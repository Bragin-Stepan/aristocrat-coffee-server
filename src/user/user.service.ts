import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { Role, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { changeRoleDto } from './dto/change-rule.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany();
	}

	async auth(dto: UserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { telegramID: dto.telegramID },
		});

		const userData = this.prepareUserData(dto, existingUser?.isWasTGPremium);

		const user = await this.prisma.user.upsert({
			where: { telegramID: dto.telegramID },
			update: {
				...userData,
				updatedAt: new Date(),
			},
			create: {
				telegramID: dto.telegramID,
				...userData,
			},
		});
	}

	async getUser(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) throw new NotFoundException('User not found');
		return this.formatUserResponse(user);
	}

	async deleteUser(id: string) {
		try {
			await this.prisma.user.delete({ where: { id } });
			return { message: 'User deleted successfully' };
		} catch (error) {
			if (this.isNotFoundError(error)) {
				throw new NotFoundException('User not found');
			}
			throw error;
		}
	}

	async updateUser(id: string, dto: UserDto) {
		const existingUser = await this.prisma.user.findUnique({ where: { id } });
		if (!existingUser) throw new NotFoundException('User not found');

		const userData = this.prepareUserData(dto, existingUser.isWasTGPremium);

		const user = await this.prisma.user.update({
			where: { id },
			data: {
				...userData,
				updatedAt: new Date(),
			},
		});

		return this.formatUserResponse(user);
	}

	async changeUserRole(dto: changeRoleDto) {
		const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
		if (!user) throw new NotFoundException('User not found');

		if (user.role !== Role.ADMIN) {
			throw new ForbiddenException('Only admins can change user roles');
		}
		const targetUser = await this.prisma.user.findUnique({
			where: { id: dto.targetId },
		});
		if (!targetUser) throw new NotFoundException('Target user not found');
		const updatedUser = await this.prisma.user.update({
			where: { id: dto.targetId },
			data: { role: dto.newRole },
		});

		return this.formatUserResponse(updatedUser);
	}

	private prepareUserData(dto: UserDto, currentWasPremium?: boolean) {
		const isWasPremium = dto.isTGPremium ? true : currentWasPremium;

		return {
			username: dto.username,
			firstName: dto.firstName,
			lastName: dto.lastName,
			isTGPremium: dto.isTGPremium,
			isWasTGPremium: isWasPremium,
			phoneNumber: dto.phoneNumber,
			photoURL: dto.photoURL,
			languageCode: dto.languageCode,
		};
	}

	private formatUserResponse(user: User) {
		return {
			id: user.id,
			telegramID: user.telegramID,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			phoneNumber: user.phoneNumber,
			isTGPremium: user.isTGPremium,
			isWasTGPremium: user.isWasTGPremium,
			photoURL: user.photoURL,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	private isNotFoundError(error: unknown): boolean {
		return (
			error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
		);
	}
}
