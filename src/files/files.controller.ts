import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Auth([Role.ADMIN])
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: await this.filesService.uploadFile(file.buffer, file.originalname),
    };
  }

  @Delete('delete')
  @Auth([Role.ADMIN])
  async deleteFile(@Body() body: { url: string }) {
    await this.filesService.deleteFile(body.url);
    return { success: true };
  }
}