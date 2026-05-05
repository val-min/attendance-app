import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

export interface EmployeeWithPassword extends Employee {
  plainPassword: string;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      select: [
        'id',
        'name',
        'email',
        'department',
        'position',
        'role',
        'created_at',
      ],
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');
    return employee;
  }

  // async create(data: Partial<Employee>): Promise<Employee> {
  //   const hashed = await bcrypt.hash(data.password as string, 10);
  //   const employee = this.employeeRepository.create({
  //     ...data,
  //     password: hashed,
  //   });
  //   return this.employeeRepository.save(employee);
  // }

  // async update(id: number, data: Partial<Employee>): Promise<Employee> {
  //   const employee = await this.findOne(id);
  //   if (data.password) {
  //     data.password = await bcrypt.hash(data.password, 10);
  //   }
  //   Object.assign(employee, data);
  //   return this.employeeRepository.save(employee);
  // }

  async create(dto: CreateEmployeeDto): Promise<EmployeeWithPassword> {
    // Password auto generate dari nama + angka random
    const randomPassword = `${dto.name.replace(/\s/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;

    const hashed = await bcrypt.hash(randomPassword, 10);

    const employee = this.employeeRepository.create({
      ...dto,
      password: hashed,
    });

    const saved = await this.employeeRepository.save(employee);

    // Kembalikan password asli sekali saja
    // agar admin bisa kasih tau ke karyawan
    return { ...saved, plainPassword: randomPassword };
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    // Tidak ada logika password sama sekali ✅
    Object.assign(employee, dto);

    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id);

    // Hapus dulu semua absensi milik karyawan ini
    await this.employeeRepository.query(
      'DELETE FROM attendances WHERE employee_id = ?',
      [id],
    );

    await this.employeeRepository.remove(employee);
    return { message: 'Karyawan berhasil dihapus' };
  }
}
