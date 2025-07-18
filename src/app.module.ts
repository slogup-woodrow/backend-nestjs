import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import envFilePath from 'envs/env';
import { commonConstants } from './shared/constants/common.constants';
import { dataSourceOptions } from './shared/database/config/typeorm.config';
import { StaticBoardModule } from './domain/static-board/static-board.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(...commonConstants.props.NODE_ENV_ARRAY)
          .required(),
        TZ: Joi.string().valid('Asia/Seoul').required(),
      }),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    //JWT
    StaticBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
