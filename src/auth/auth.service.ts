import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RowDataPacket } from 'mysql2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(full_name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    await this.db.query(sql, [email, hashedPassword]);
    return { message: 'User registered successfully ' };
  }

  async login(email: string, password: string) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = (await this.db.query(sql, [email])) as RowDataPacket[];

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0] as { id: number; email: string; password: string };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ JWT_SECRET from .env
    const token = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );

    return { access_token: token };
  }
}
