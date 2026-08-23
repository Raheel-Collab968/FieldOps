import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GrantModulePermissionDto } from './dto/grant-module-permission.dto';

const ALLOWED_ACTIONS = [
  'canCreate',
  'canEdit',
  'canDelete',
  'canUpdate',
  'canView',
] as const;

type PermissionAction = (typeof ALLOWED_ACTIONS)[number];

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const existing = await this.permissionModel.findOne({
      userId: createPermissionDto.userId,
    });
    if (existing) {
      throw new BadRequestException(
        'A permission document already exists for this user',
      );
    }
    return this.permissionModel.create(createPermissionDto);
  }

  async findAll() {
    return this.permissionModel.find().exec();
  }

  async findByUser(userId: string) {
    return this.permissionModel.findOne({ userId }).exec();
  }

  async findOne(id: string) {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const updated = await this.permissionModel
      .findByIdAndUpdate(id, updatePermissionDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Permission not found');
    }
    return updated;
  }

  async remove(id: string) {
    const removed = await this.permissionModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException('Permission not found');
    }
    return { message: 'Permission removed' };
  }

  async grantModule(dto: GrantModulePermissionDto) {
    const { userId, userRole, module, permissions } = dto;
    return this.permissionModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          $set: {
            userRole,
            [`permissions.${module}`]: permissions,
          },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  async revokeModule(userId: string, module: string) {
    const updated = await this.permissionModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $unset: { [`permissions.${module}`]: 1 } },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException('Permission document not found for user');
    }
    return updated;
  }

  async check(
    userId: string,
    module: string,
    action: string,
  ): Promise<boolean> {
    if (!ALLOWED_ACTIONS.includes(action as PermissionAction)) {
      throw new BadRequestException(`Invalid action: ${action}`);
    }

    const permission = await this.permissionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!permission || !permission.permissions) {
      return false;
    }

    const modulePermissions = permission.permissions.get(module);
    if (!modulePermissions) {
      return false;
    }

    return modulePermissions[action as PermissionAction] === true;
  }

  async can(userId: string, module: string, action: string): Promise<boolean> {
    return this.check(userId, module, action);
  }
}
