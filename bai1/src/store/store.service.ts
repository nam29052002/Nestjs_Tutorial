import { Inject, Injectable } from "@nestjs/common";
import { STORE_CONFIG_TOKEN, StoreConfig } from "./store.config";
import * as fs from "fs";

@Injectable()
export class StoreService {
    constructor(private readonly storeConfig: StoreConfig) {
        if (fs.existsSync(this.storeConfig.dirname) == false) {
            fs.mkdirSync(this.storeConfig.dirname);
        }
    }

    save(data: any): void {
        fs.appendFileSync(`${this.storeConfig.dirname}/${this.storeConfig.filename}`, JSON.stringify(data) + '\n');
    }
}