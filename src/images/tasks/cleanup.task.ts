import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImagesService } from '../images.service';

@Injectable()
export class CleanupTask {
  private readonly logger = new Logger(CleanupTask.name);

  constructor(private readonly imagesService: ImagesService) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  async handleCleanup() {
    this.logger.log('Running unused images cleanup...');
    try {
      await this.imagesService.cleanupUnusedImages();
      this.logger.log('Unused images cleanup completed');
    } catch (error) {
      this.logger.error('Failed to cleanup unused images', error.stack);
    }
  }
}