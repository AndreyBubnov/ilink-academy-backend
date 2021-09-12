import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationException } from '../exception/validation.exception';

@Injectable()
export class CustomValidationPipe<TValue> implements PipeTransform<TValue> {
  async transform(value: TValue, metadata: ArgumentMetadata): Promise<TValue> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.reduce(
        (prev, next) => ({
          ...prev,
          [next.property]: Object.values(next.constraints),
        }),
        {},
      );
      throw new ValidationException(messages);
    }
    return value;
  }
}
