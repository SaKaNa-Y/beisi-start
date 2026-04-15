import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly users = [{ username: 'admin', password: '123456' }];

  login(dto: LoginDto) {
    const user = this.users.find(
      (u) => u.username === dto.username && u.password === dto.password,
    );

    if (user) {
      return {
        code: 0,
        message: 'Login successful',
        data: { token: randomUUID() },
      };
    }

    return {
      code: 1,
      message: 'Invalid username or password',
      data: null,
    };
  }
}
