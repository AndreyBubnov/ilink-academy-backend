import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIsUserWithEmailExist(createUserDto.email);
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  findByName(name: string) {
    return this.usersRepository.find({ name });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkIsUserWithEmailExist(updateUserDto.email);
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.softDelete(id);
  }

  async checkIsUserWithEmailExist(email?: string) {
    if (email) {
      const users = await this.usersRepository.find({
        withDeleted: true,
        where: {
          email,
        },
      });
      if (users.length > 0) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            email: `user with email: ${email} already exist`,
          },
          message: 'Bad request',
        });
      }
    }
  }
}
