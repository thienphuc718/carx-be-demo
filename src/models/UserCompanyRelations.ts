import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './Users';
import { CompanyModel } from './Companies';

@Table({
  modelName: 'user_company_relations',
})
export class UserCompanyRelationsModel extends Model<UserCompanyRelationsModel> {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  company_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => UserModel, 'user_id')
  user_relations: UserModel[];

  @BelongsTo(() => CompanyModel, 'company_id')
  company_relations: CompanyModel[];
}
