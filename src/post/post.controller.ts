import { Body, Controller, Get, Param, Post, Redirect, Render, Res, Session } from '@nestjs/common';
import { AddPostDto } from './dto/addPostDto';
import { PostService } from './post.service';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
@Controller('post')
export class PostController {
    constructor(private readonly postService : PostService){}
    @Get("/add")
    @Render("post/addPost")
    getAddPost(){}

    @Post("/add")
    @Redirect("/")
    async postAddPost(@Body() body : AddPostDto, @Session() session : Record<string, any>){
        const currentUser : User = session.user
        return await this.postService.postAddPost(body, currentUser)
    }
    @Get("/detail/:id")
    @Render("post/detail")
    async getDetailPost(@Param("id") id : string, @Res() res : Response) {
        try{
           const post = await this.postService.getDetailPost(id)
           return {post}
        } catch (error){
            res.status(404).render("errors/404", {message : error.message})
        }
    }
}