import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employees/employee.entity';
import { Attendance } from './attendance/attendance.entity';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employee.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Admin123', // ← ganti ini
      database: 'attendance_db',
      entities: [Employee, Attendance],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    EmployeesModule,
    AttendanceModule,
  ],
})
export class AppModule {}
