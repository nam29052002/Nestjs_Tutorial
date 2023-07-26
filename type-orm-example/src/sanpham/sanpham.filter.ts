import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
@Catch(HttpException)
export class SanPhamHandlerException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const statusCode = exception.getStatus();

        response.status(statusCode).json({
            statusCode: statusCode,
            message: (statusCode == 500) ? 'Id san pham khong ton tai' : 'Id san pham phai la so'
        });
    }
}