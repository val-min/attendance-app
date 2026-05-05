import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeesService, EmployeeWithPassword } from './employee.service';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

@Controller('employees')
@UseGuards(AuthGuard('jwt'))
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(+id);
  }

  // Pakai partial Employee
  // @Post()
  // create(@Body() body: Partial<Employee>): Promise<Employee> {
  //   return this.employeesService.create(body);
  // }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() body: Partial<Employee>,
  // ): Promise<Employee> {
  //   return this.employeesService.update(+id, body);
  // }

  // Pakai DTO
  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<EmployeeWithPassword> {
    // ← hapus return type Promise<Employee>
    return this.employeesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.employeesService.remove(+id);
  }
}
