import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto {

  @IsNumber()
  telegramId: number;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsBoolean()
  isTGPremium: boolean;

  @IsOptional()
  @IsString()
  photoURL?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  languageCode: string;
}