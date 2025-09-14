import { BadRequestException, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { getMessageFromExceptionResponse } from '../helpers';

@Catch(BadRequestException)
export class ValidationErrorFilter implements RpcExceptionFilter {
  catch(exception: BadRequestException): Observable<object> {
    const message = getMessageFromExceptionResponse(exception.getResponse());

    return throwError(() => ({
      statusCode: 400,
      message,
    }));
  }
}
