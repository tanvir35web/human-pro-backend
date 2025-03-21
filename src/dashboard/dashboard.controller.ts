import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  // Get user dashboard data
  @Get()
  async getDashboard(@Query('userId') userId: number) {
    return this.dashboardService.getDashboard(userId);
  }

  // Save user dashboard data
  @Post()
  async saveDashboard(
    @Body('userId') userId: number,
    @Body('nameOfPlan') nameOfPlan: string,
    @Body('estimatedTime') estimatedTime: number,
    @Body('scope') scope: string,
  ) {
    return this.dashboardService.saveDashboard(
      userId,
      nameOfPlan,
      estimatedTime,
      scope,
    );
  }
}