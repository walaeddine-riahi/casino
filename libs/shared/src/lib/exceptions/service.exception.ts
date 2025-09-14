import { RpcException } from '@nestjs/microservices';

export type ServiceExceptionInfo = {
  statusCode: number;
  message?: string;
  code?: number;
};

export class ServiceException extends RpcException {
  private info: ServiceExceptionInfo;

  constructor(info: ServiceExceptionInfo) {
    super(info);
    this.info = info;
  }

  getInfo(): ServiceExceptionInfo {
    return this.info;
  }
}
