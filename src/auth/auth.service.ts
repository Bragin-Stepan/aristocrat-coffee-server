import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { returnUserObject } from 'src/user/return-user.object';

// Все работает корректно, но в этом проекте она не нужна
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async login(dto: UserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { telegramID: dto.telegramID },
		});

		const userData = this.prepareUserData(dto, existingUser?.isWasTGPremium);

		const user = await this.prisma.user.upsert({
			where: {
				telegramID: dto.telegramID,
				// phoneNumber: dto.phoneNumber, // для нормальной безопасности нужон + одноразовый код в тг
			},
			update: {
				...userData,
				updatedAt: new Date(),
			},
			create: {
				telegramID: dto.telegramID,
				...userData,
			},
			select: returnUserObject,
		});

		this.getAuthData(user);
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);
		if (!result) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id,
			},
		});

		if (!user) throw new NotFoundException('User not found');

		this.getAuthData(user);
	}

	private async issueTokens(userId: string) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	private async validateUser(telegramID) {
		const user = await this.prisma.user.findUnique({
			where: { telegramID: telegramID },
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	private async getAuthData(user: User) {
		const tokens = await this.issueTokens(user.id);
		return {
			id: user.id,
			username: user.username,
			...tokens,
		};
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
}
