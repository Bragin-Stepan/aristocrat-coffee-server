import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({  
  imports: [
    ConfigModule.forRoot(),
    // AuthModule,
    UserModule
  ],
  controllers: [AppController], //! hello
  providers: [AppService], //! hello
})
export class AppModule {}
