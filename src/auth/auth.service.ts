import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';


// Все работает корректно, но в этом проекте она не нужна
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async register(dto: AuthDto) {
		// const oldUser = await this.prisma.user.findUnique({
		// 	where: {
		// 		email: dto.email,
		// 	},
		// });
		// if (oldUser) {
		// 	throw new BadRequestException('User already exists');
		// }

		// const user = await this.prisma.user.create({
		// 	data: {
		// 		email: dto.email,
		// 		username: faker.person.firstName(),
		// 		photoURL: faker.image.avatar(),
		// 		phoneNumber: faker.phone.number(),
		// 		password: await hash(dto.password),
		// 	},
		// });

		// this.getAuthData(user);
	}

	async login(dto: AuthDto) {
		// const user = await this.validateUser(dto);
		// this.getAuthData(user);
	}

	async getNewTokens(refreshToken: string) {
	// 	const result = await this.jwt.verifyAsync(refreshToken);
	// 	if (!result) throw new UnauthorizedException('Invalid refresh token');

	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			id: result.id,
	// 		},
	// 	});

	// 	if (!user) throw new NotFoundException('User not found');

	// 	this.getAuthData(user);
	// }

	// private async issueTokens(userId: string) {
	// 	const data = { id: userId };

	// 	const accessToken = this.jwt.sign(data, {
	// 		expiresIn: '1h',
	// 	});

	// 	const refreshToken = this.jwt.sign(data, {
	// 		expiresIn: '7d',
	// 	});

	// 	return { accessToken, refreshToken };
	}

	private returnUserFields(user: User) {
		// return {
		// 	id: user.id,
		// 	email: user.email,
		// };
	}

	private async validateUser(dto: AuthDto) {
		// const user = await this.prisma.user.findUnique({
		// 	where: { email: dto.email },
		// });
		// if (!user) {
		// 	throw new NotFoundException('User not found');
		// }

		// const isVailde = await verify(user.password, dto.password);
		// if (!isVailde) throw new UnauthorizedException('Invalid password');

		// return user;
	}

  private async getAuthData (user: User) {

  //   const tokens = await this.issueTokens(user.id);
	// 	return {
	// 		user: this.returnUserFields(user),
	// 		...tokens,
	// 	};
  }
}
