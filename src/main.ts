import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { commonConstants } from './shared/constants/common.constants';
import { DataSource } from 'typeorm';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { swaggerConstants } from './shared/constants/swagger.constants';
import basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const rootPath = join(__dirname, '..', '..', '..', 'public');
  const port = parseInt(process.env.PORT, 10);
  const env = process.env.NODE_ENV;
  const timezone = process.env.TZ;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  //서버 내에서 view 관련 정보를 위한 세팅
  app.useStaticAssets(rootPath);
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');

  /**
   * CORS
   */
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: [
      'Authorization',
      'Content-Disposition', // 파일 다운로드 시 프론트 코드에서 파일명을 읽기 위해 추가함
    ],
  });

  /**
   * Body-parser
   */
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * logger
   */
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  /**
   * globalPipes
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // When set to true, this will automatically remove non-whitelisted properties (those without any decorator in the validation class).
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes.
    }),
  );

  /**
   * GlobalFilters
   */
  app.useGlobalFilters(new HttpExceptionFilter(logger, app.get(DataSource)));

  /**
   * Swagger
   */
  if (process.env.NODE_ENV !== commonConstants.props.nodeEnvs.LOCAL) {
    // local 외의 환경변수에서는 Basic authentication 설정
    app.use(
      [swaggerConstants.props.SWAGGER_PATH],
      basicAuth({
        challenge: true,
        users: {
          [swaggerConstants.props.SWAGGER_USER]:
            swaggerConstants.props.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle(swaggerConstants.props.SWAGGER_TITLE)
    .setDescription(swaggerConstants.props.SWAGGER_DESCRIPTION)
    .setVersion(swaggerConstants.props.SWAGGER_VERSION)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'jwt' },
      swaggerConstants.auth.BEARER_TOKEN,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConstants.props.SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 웹(swagger)에서 새로고침을 해도 authorization(token) 유지
      // docExpansion: 'none', // 모든 태그가 닫힌 상태로 swagger 페이지 오픈
      tagsSorter: 'alpha', // 태그를 정렬합니다.
    },
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
