import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('checkin')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async checkIn(
    @Request() req: { user: { id: number } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Foto wajib diupload');
    const photoUrl = `/uploads/${file.filename}`;
    return this.attendanceService.checkIn(req.user.id, photoUrl);
  }

  @Post('checkout')
  async checkOut(@Request() req: { user: { id: number } }) {
    return this.attendanceService.checkOut(req.user.id);
  }

  @Get('me')
  async getMyAttendance(@Request() req: { user: { id: number } }) {
    return this.attendanceService.getMyAttendance(req.user.id);
  }

  @Get('all')
  async getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }
}
