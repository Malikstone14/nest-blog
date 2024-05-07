import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPostDto } from './dto/addPostDto';
import {InjectRepository} from  "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {Post} from './post.entity'
import { User } from 'src/user/user.entity';

@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private readonly postRepository : Repository<Post>){}
    async postAddPost(body: AddPostDto, user: User) {
        const post = this.postRepository.create(body)
        post.user = user
        await this.postRepository.save(post)
        return "Article Crée !"
    }
    async getAllPosts() {
        const posts = await this.postRepository.find({order : {created_at : "DESC"}})
        return posts
    }
    async getDetailPost(id: string) {
        const post = await this.postRepository.findOne({
             where : {id : +id},
             relations : {user: true},
            })
        if(!post) throw new NotFoundException("L'article n'existe pas")
        return post
    }
}
