import { Injectable, Scope } from "@nestjs/common";

@Injectable({scope: Scope.TRANSIENT})
export class LoggerCustomService {
    private count: number = 0;
    log(): number {
        this.count++;
        return this.count
    }
}