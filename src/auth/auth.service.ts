import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserDto } from 'src/user/dto/user.dto';
import { returnUserObject } from 'src/user/return-user.object';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async login(dto: UserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { telegramId: dto.telegramId },
		});

		const userData = this.prepareUserData(dto, existingUser?.isWasTGPremium);

		const user = await this.prisma.user.upsert({
			where: {
				telegramId: dto.telegramId,
				//! phoneNumber: dto.phoneNumber, // для нормальной безопасности нужон
				//! verificationCode: dto.verificationCode, // + одноразовый код в тг
			},
			update: {
				...userData,
				updatedAt: new Date(),
			},
			create: {
				telegramId: dto.telegramId,
				...userData,
			},
			select: returnUserObject,
		});

		return this.getAuthData(user);
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

		return this.getAuthData(user);
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

	private async getAuthData(user: User) {
		const tokens = await this.issueTokens(user.id);
		return {
			user: user,
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
