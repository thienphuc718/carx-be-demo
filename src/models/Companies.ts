import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';

import { UserModel } from './Users';
import { UserCompanyRelationsModel } from './UserCompanyRelations';

@Table({
  modelName: 'companies',
})
export class CompanyModel extends Model<CompanyModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  tax_id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  size: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  license: string[];

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  other_info: string[];

  @BelongsToMany(() => UserModel, () => UserCompanyRelationsModel)
  user_ids: UserModel[];

  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
