import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import envFilePath from 'envs/env';
import { commonConstants } from './shared/constants/common.constants';
import { AppDataSource } from './database/config/typeorm.config';
import { StaticBoardModule } from './domain/static-board/static-board.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { getStringifiedDateTypeA } from './shared/helpers/date.helper';
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
    TypeOrmModule.forRoot(AppDataSource.options),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp({
              format: () => getStringifiedDateTypeA(),
            }),
          ),
        }),
      ],
    }),
    //JWT
    StaticBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
