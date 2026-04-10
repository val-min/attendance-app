import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const employee = await this.employeeRepository.findOne({
      where: { email },
    });

    if (!employee) {
      console.log('Debug: User tidak ditemukan untuk email:', email);
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
      },
    };
  }
}
