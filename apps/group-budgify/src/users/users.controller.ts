import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { PasswordPipe } from '../auth/password-pipe/password.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @UsePipes(new PasswordPipe())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }
}
