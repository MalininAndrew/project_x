import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
      private readonly authService: AuthService,
    
    ) {}

    @Post('registration')
    async register(@Body() dto: RegisterDto) {
       return this.authService.registration(dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() { login, password }: AuthDto) {
      const user = await this.authService.validateUser(login, password);
      return this.authService.login(user.email)
	}
}
