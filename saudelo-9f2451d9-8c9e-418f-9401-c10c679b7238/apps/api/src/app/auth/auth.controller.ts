import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }
    @Post('register')
  register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('orgId') orgId: string,
  ) {
    return this.authService.register(username, password, orgId);
  }
  
}