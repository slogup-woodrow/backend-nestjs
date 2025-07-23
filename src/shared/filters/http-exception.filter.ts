import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { DataSource } from 'typeorm';
import { commonConstants } from '../constants/common.constants';
import { get } from 'lodash';

dayjs.extend(utc);
dayjs.extend(timezone);

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly dataSource: DataSource, // private slackService: SlackService,
  ) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof HttpException ? exception.getResponse() : exception;

    const languages = commonConstants.props.languages;
    const acceptLanguage = get(req, 'headers.accept-language');
    const messageLanguage =
      typeof acceptLanguage === 'string' &&
      languages[acceptLanguage.toUpperCase()]
        ? languages[acceptLanguage.toUpperCase()]
        : languages.KO;

    const errorCode = get(error, 'errorCode') || undefined;
    const message = error['message']
      ? error['message']
      : error[messageLanguage]
        ? error[messageLanguage]
        : error;
    const data = error['data'] || undefined;
    const stack = exception['stack'] || undefined;
    const resData =
      statusCode >= 500
        ? {
            statusCode,
            message,
            stack,
          }
        : {
            statusCode,
            errorCode,
            message,
            data,
            error:
              exception instanceof HttpException ? exception.name : undefined,
          };

    return res.status(statusCode).json(resData);
  }
}
