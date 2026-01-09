import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
const saltRounds = 10;


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}  

 async register(username: string, password: string, orgId: string) {
  console.log('Register called with:', username, orgId);
  console.log('usersRepo:', this.usersRepo);
    const existingUser = await this.usersRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.usersRepo.create({username, password: hashedPassword, orgId});
    
    return {
      user: await this.usersRepo.save(user),
    };
  }

  async login(username: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      orgId: user.orgId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: { //for debugging purposes
        id: user.id,
        username: user.username,
        orgId: user.orgId,
     },
    };
  }
}
