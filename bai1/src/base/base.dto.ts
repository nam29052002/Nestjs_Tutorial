import { Expose } from "class-transformer";
import { plainToClass } from "class-transformer";

export class BaseDTO {
    @Expose()
    id: number;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    public static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToClass(this, obj, {excludeExtraneousValues: true});
    }
}
