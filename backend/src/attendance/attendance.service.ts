import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async checkIn(employeeId: number, photoUrl: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];

    const existing = await this.attendanceRepository.findOne({
      where: { employee: { id: employeeId }, date: today },
    });

    if (existing) {
      throw new Error('Kamu sudah absen hari ini');
    }

    const now = new Date();
    const hour = now.getHours();
    const status = hour >= 9 ? 'late' : 'present';

    const attendance = this.attendanceRepository.create({
      employee: { id: employeeId },
      date: today,
      check_in: now,
      photo_url: photoUrl,
      status,
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(employeeId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await this.attendanceRepository.findOne({
      where: { employee: { id: employeeId }, date: today },
    });

    if (!attendance) {
      throw new Error('Kamu belum absen masuk hari ini');
    }

    attendance.check_out = new Date();
    return this.attendanceRepository.save(attendance);
  }

  async getMyAttendance(employeeId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { employee: { id: employeeId } },
      order: { created_at: 'DESC' },
    });
  }

  async getAllAttendance(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['employee'],
      order: { created_at: 'DESC' },
    });
  }
}
