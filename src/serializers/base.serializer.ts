import { HttpStatus } from '@nestjs/common';

export interface SerializerResponse<T> {
  data: T;
  meta?: any;
  status: number;
  success: boolean;
}

export abstract class BaseSerializer<T> {
  abstract serialize(item: T, additionalData: object): any;

  respondMany(
    items: T[],
    additionalData: object = [],
    pagination?: any,
  ): SerializerResponse<any[]> {
    const data = items.map((item) => this.serialize(item, additionalData));
    return {
      status: HttpStatus.OK,
      success: true,
      data,
      meta: pagination,
    };
  }

  respond(item: T, additionalData: object = []): SerializerResponse<any> {
    const data = this.serialize(item, additionalData);

    return {
      status: HttpStatus.OK,
      success: true,
      data: data,
    };
  }
}
