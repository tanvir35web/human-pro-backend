import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private pool: mysql.Pool;

  constructor(private configService: ConfigService) {
    this.pool = mysql.createPool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query(sql: string, params: any[] = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
}
