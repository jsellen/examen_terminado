import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}


  async create(_createUserDto:CreateUserDto) {
    // _createUserDto trae en BODY los datos
    const userCreated = this.userModel.create(_createUserDto)
    return userCreated;
  }

  async findAll() {
    const list = await this.userModel.find();
    return list
  }

  async findOne(id: string) {
    const list = await this.userModel.findById(id);
    return list
  }

  async update(id: string, _updateUserDto:UpdateUserDto) {
    const list = await this.userModel.findByIdAndUpdate(id,_updateUserDto);
    return list
  }

  async remove(id: string) {
    try {
    const list = await this.userModel.findByIdAndDelete(id)
    return list      
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
