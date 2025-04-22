import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 4200
async function bootstrap() {
  console.log(`Launching NestJS app on port ${port}, URL: http://0.0.0.0:${port}`);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableShutdownHooks();
  app.enableCors() 
  await app.listen(port);
}
bootstrap();
