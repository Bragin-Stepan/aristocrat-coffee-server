import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaService } from 'src/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupTask } from './tasks/cleanup.task';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ImagesController],
  providers: [ImagesService, PrismaService, CleanupTask],
  exports: [ImagesService],
})
export class ImagesModule {}