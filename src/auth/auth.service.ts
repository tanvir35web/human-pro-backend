import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
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

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await this.db.query(sql, [username, hashedPassword]);
    return { message: 'User registered successfully' };
  }

  async login(username: string, password: string) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const users = (await this.db.query(sql, [username])) as RowDataPacket[];

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ JWT_SECRET from .env
    const token = this.jwtService.sign(
      { userId: user.id, username: user.username },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );

    return { access_token: token };
  }
}
