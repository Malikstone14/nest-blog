import { Session, Controller, Get, Render, Post, Body, Redirect , UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { SignupDto } from './dto/SignupDto';
import { LoginDto } from './dto/LoginDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}

    @Get('/signup')
    @Render('user/signup')
    getSignup(){}

    @Get('/login')
    @Render('user/login')
    getLogin(){}

    @Post('/signup')
    @Redirect('user/login')
    async postSignup(@Body() body : SignupDto){
        return {message : await this.userService.postSignup(body)}
    }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/login')
    async postlogin(@Body() body: LoginDto, @Session() session : Record<string, any>){
        const user = await this.userService.postLogin(body)
        session.user = user
        session.connected = true
        return session
    }
}
