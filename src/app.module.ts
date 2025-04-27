import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({  
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
  ]
})
export class AppModule {}
