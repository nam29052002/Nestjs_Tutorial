import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from "@nestjs/common";
import { Request, Response } from 'express';

@Injectable()
@Catch(HttpException, Error)
export class UserFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        response
            .status(status)
            .json({
                statusCode: status,
                message: exception.message
            });
        // response.contentType('application/json');
        // response.send(JSON.stringify({
        //     statusCode: status,
        //     message: exception.message
        // }))
    }
}