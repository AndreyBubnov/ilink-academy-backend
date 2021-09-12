import { HttpException, HttpStatus } from '@nestjs/common';

type ExceptionMessage = Record<string, string>;

export class ValidationException extends HttpException {
  constructor(errors: ExceptionMessage) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
        message: 'Bad request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
