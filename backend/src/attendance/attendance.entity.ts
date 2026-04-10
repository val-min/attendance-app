import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  check_in: Date;

  @Column({ nullable: true })
  check_out: Date;

  @Column({ nullable: true })
  photo_url: string;

  @Column({
    type: 'enum',
    enum: ['present', 'late', 'absent'],
    default: 'present',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
