import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum EmployeeRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole = EmployeeRole.EMPLOYEE; // ← default employee
}

// update-employee.dto.ts
export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole;
}
