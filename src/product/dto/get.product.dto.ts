import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class GetProductDto {
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
