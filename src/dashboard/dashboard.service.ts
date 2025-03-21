import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  // Fetch Dashboard Data (GET)
  async getDashboard(userId: number) {
    if (!userId) {
      return { message: 'No user ID provided.' };
    }
    const sql = 'SELECT * FROM plans WHERE user_id = ?';
    const plans = (await this.db.query(sql, [userId])) as RowDataPacket[];

    if (plans.length === 0) {
      return { message: 'No plan found for this user.' };
    }

    return plans[0]; // Return the first plan
  }

  // Save Dashboard Data (POST)
  async saveDashboard(
    userId: number,
    nameOfPlan: string,
    estimatedTime: number,
    scope: string,
  ) {
    const sql = `
            INSERT INTO plans (user_id, name_of_plan, estimated_time, scope) 
            VALUES (?, ?, ?, ?)
        `;
    await this.db.query(sql, [userId, nameOfPlan, estimatedTime, scope]);

    return { message: 'Dashboard data saved successfully!' };
  }
}
