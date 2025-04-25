import { IsArray, IsString } from 'class-validator';

export class UpdatePriorityDto {
  
  @IsString({ each: true })
  @IsArray()
  ids: string[];
}