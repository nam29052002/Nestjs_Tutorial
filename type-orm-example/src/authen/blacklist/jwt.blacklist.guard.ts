import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtBlaclistService } from './jwt.blacklist.service';

@Injectable()
export class JwtBlaclistGuard implements CanActivate {
  constructor(private readonly backlistService: JwtBlaclistService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return (async function (
      backlistService: JwtBlaclistService,
    ): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization?.split(' ')[1];
      let existsInBlacklist = false;
      await backlistService.tokenInBlacklist(token).then((resutl) => {
        existsInBlacklist = resutl;
      });
      if (token && existsInBlacklist) {
        // console.log('ok', existsInBlacklist);
        return true; // chưa logout
      }
      return false;
    })(this.backlistService);
  }
}
