import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ _id: false })
export class ModulePermissions {
  @Prop({ default: false })
  canCreate!: boolean;

  @Prop({ default: false })
  canEdit!: boolean;

  @Prop({ default: false })
  canDelete!: boolean;

  @Prop({ default: false })
  canUpdate!: boolean;

  @Prop({ default: false })
  canView!: boolean;
}

export const ModulePermissionsSchema =
  SchemaFactory.createForClass(ModulePermissions);

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  userRole!: string;

  @Prop({ type: Map, of: ModulePermissionsSchema, default: () => new Map() })
  permissions!: Map<string, ModulePermissions>;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
