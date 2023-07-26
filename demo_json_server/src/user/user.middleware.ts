import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class UserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // res.json({
        //     statusCode: 500,
        //     message: 'Modified response data',
        // });
        // console.log('before');
        res.contentType('application/json');
        res.status(500);
        res.send(JSON.stringify({ statusCode: 500, message: 'nam' }));
        next();
        // console.log('after');
    }
}