import { Inject, Injectable } from "@nestjs/common";
import { StoreService } from "src/store/store.service";
import { PostDTO } from "./post.dto";

@Injectable()
export class PostService {
    constructor(@Inject('STORE_SERVICE_post.json') private readonly storeService: StoreService) {}

    createPost(post: PostDTO): PostDTO {
        const postReal = PostDTO.plainToClass(post);
        this.storeService.save(post);
        return postReal;
    }
}