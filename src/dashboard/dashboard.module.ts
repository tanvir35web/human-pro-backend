import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DatabaseService],
})
export class DashboardModule {}
