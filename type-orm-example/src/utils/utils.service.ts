import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class UtilsService {
  constructor(private moduleRef: ModuleRef) {}

  async getService<T>(serviceClass: Type<T>): Promise<any> {
    let service = this.moduleRef.get(serviceClass, { strict: false });
    if (!service) service = await this.moduleRef.create(serviceClass);
    return service;
  }
}