import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
@Catch(HttpException)
export class SanPhamHandlerException implements ExceptionFilter {
    constructor(private readonly message: string) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const statusCode = exception.getStatus();
        const messageSent = exception.getStatus() == 500 ? exception.message : this.message;
        
        // response.setHeader('Content-Type', 'application/json');
        // response.statusCode = statusCode;
        // response.statusMessage = JSON.stringify({ statusCode: statusCode, message: this.message });
        // response.send();
        // response.send(JSON.stringify({ statusCode: statusCode, message: this.message }));

        response.status(statusCode).json({
            statusCode: statusCode,
            message: messageSent
        });
    }
}