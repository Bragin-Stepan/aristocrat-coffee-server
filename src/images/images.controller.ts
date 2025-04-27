import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { FullIImageUrlInterceptor } from './decorators/full-image-url.decorator';

@UseInterceptors(FullIImageUrlInterceptor)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @Auth([Role.ADMIN])
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file: any, cb) => {
          const randomName = uuidv4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    const imageData = {
      ...createImageDto,
      filename: file.filename,
      url: `/uploads/images/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    };

    return this.imagesService.createImage(imageData);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Auth([Role.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.getImageById(id);
  }

  @Auth([Role.ADMIN])
  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.imagesService.getImagesByProductId(productId);
  }

  @Auth([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.deleteImage(id);
  }
}