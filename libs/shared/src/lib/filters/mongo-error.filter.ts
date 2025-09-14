import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Error as MongoError } from 'mongoose';
import { Observable, throwError } from 'rxjs';

@Catch(MongoError)
export class MongoErrorFilter
  implements RpcExceptionFilter<MongoError, object>
{
  catch(exception: MongoError): Observable<object> {
    return throwError(() => ({
      statusCode: 400,
      message: exception.message,
    }));
  }
}
