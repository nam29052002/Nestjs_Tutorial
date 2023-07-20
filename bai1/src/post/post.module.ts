import { DynamicModule, Module } from "@nestjs/common";
import { StoreConfig } from "src/store/store.config";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { StoreModule } from "src/store/store.module";

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [StoreModule.forFeature({
        filename: 'post.json'
    })]
})
export class PostModule {    
}