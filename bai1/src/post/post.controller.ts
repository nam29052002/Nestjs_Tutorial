import { Body, Controller, Post } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostDTO } from "./post.dto";

@Controller('bai1/post')
export class PostController {
    
    constructor(private readonly postService: PostService) {}

    @Post()
    createPost(@Body() post: PostDTO): PostDTO {
        return this.postService.createPost(post);
    }
}