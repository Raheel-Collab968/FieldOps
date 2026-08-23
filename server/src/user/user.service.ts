import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from '../auth/schema/auth.schema';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { paginate } from '../admin/pagination-helper';
import { Role } from '../auth/user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async verifyEmail(email: string) {
    try {
      return await this.authModel.findOne({ email });
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(registerUserDto: Auth) {
    try {
      const allowedRoles = [Role.CLIENT, Role.TECHNICIAN];

      if (!allowedRoles.includes(registerUserDto.role)) {
      throw new BadRequestException('Invalid role');
      }
      return await this.authModel.create({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: registerUserDto.role,
        phone: registerUserDto.phone,
        isActive: registerUserDto.isActive,
      });

    } catch (err: unknown) {
      console.log(err);
      const e = err as { code?: number };

      const DUPLICATE_KEY_CODE = 11000;

      if (e.code == DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email is already taken');
      }

      throw err;
    }
  }

  async loginUser(email: string) {
    try {
      return await this.authModel.findOne({ email });
    } catch (err: unknown) {
      console.log(err);
    }
  }

  async userData(req) {
    const user = await this.authModel.findById(req.user.sub).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'User Fetched Successfully',
      user,
    };
  }

  async findAll(dto: PaginationDto) {
    try {
      const { page = 1, limit = 10, search } = dto;
      const skip = (page - 1) * limit;

      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        this.authModel
          .find(filter)
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .select('-password')
          .lean(),

        this.authModel.countDocuments(filter),
      ]);

      return {
        message: 'User Fetched Successfully',
        ...paginate(users, total, page, limit),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      const users = await this.authModel.findById(id);
      return {
        message: 'User Fetched Successfully',
        users,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    try {
      const users = await this.authModel.findById(id);
      if (users) {
        users.isActive = false;
        users.save();
        return {
          message: 'User deactivate Successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
