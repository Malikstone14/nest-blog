import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/SignupDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import* as bcrypt from "bcrypt"
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersrepository: Repository<User>,
        ) {}
        async postSignup(body: SignupDto): Promise<string> {
        try{
            const {password} = body
            const hash = await bcrypt.hashSync(password,10)
            const user = this.usersrepository.create({...body, password : hash})
            await this.usersrepository.save(user)
            return "Utilisateur crée !"
        } catch(error){
            throw new ConflictException(error.message);
        }
    }
    async postLogin(body: LoginDto) {
        const {password, email} = body
        const user = await this.usersrepository.findOne({where : {email : email}})
        if(!user )throw new NotFoundException("Utilisateur Introuvable")
        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new UnauthorizedException("Mot de passe incorrect")
        return user
    }
}
