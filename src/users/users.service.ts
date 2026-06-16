// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async create(data: Partial<User>) {
//     const user = this.userRepository.create(data);
//     return this.userRepository.save(user);
//   }
//   async findByEmail(email: string) {
//     return await this.userRepository.findOne({
//       where: { email },
//     });
//   }

//   async findById(id: number) {
//     return await this.userRepository.findOne({
//       where: { id },
//       relations: ['todos'],
//     });
//   }

//   async updateProfile(id: number, updateUserDto: UpdateUserDto) {
//     await this.userRepository.update(id, updateUserDto);

//     return this.findById(id);
//   }
// }
