import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageResponseDto } from './dto/image-response.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ImageResponseDto[]> {
    return this.prisma.image.findMany();
  }

  async createImage(createImageDto: CreateImageDto): Promise<ImageResponseDto> {    

    return this.prisma.image.create({
      data: {
        url: createImageDto.url,
        filename: createImageDto.filename,
        mimeType: createImageDto.mimeType,
        size: createImageDto.size,
        productId: createImageDto.productId,
      },
    });
  }
    
  async getImageById(id: string): Promise<ImageResponseDto> {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return image;
  }

  async deleteImage(id: string): Promise<void> {
    await this.prisma.image.delete({
      where: { id },
    });
  }

  async getImagesByProductId(productId: string): Promise<ImageResponseDto[]> {
    return this.prisma.image.findMany({
      where: { productId },
    });
  }

  async cleanupUnusedImages(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const unusedImages = await this.prisma.image.findMany({
      where: {
        createdAt: { lt: oneDayAgo },
        productId: '',
      },
    });

    for (const image of unusedImages) {
      try {        
        // await this.fileStorageService.deleteFile(image.filename);

        await this.prisma.image.delete({
          where: { id: image.id },
        });
      } catch (error) {
        console.error(`Failed to delete image ${image.id}:`, error);
      }
    }
  }
}