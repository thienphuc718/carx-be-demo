import { InjectModel } from '@nestjs/sequelize';
import { PopUpModel } from '../../../models';
import { IPopUpRepository } from './PopUpRepositoryInterface';

export class PopUpRepositoryImplementation implements IPopUpRepository {
  constructor(@InjectModel(PopUpModel) private popUpModel: typeof PopUpModel) {}
  findAll(): Promise<PopUpModel[]> {
    return this.popUpModel.findAll({
      where: {
        is_deleted: false,
      },
    });
  }
  update(id: string, payload: any): Promise<[number, PopUpModel[]]> {
    return this.popUpModel.update(payload, {
      where: {
        id: id,
        is_deleted: false,
      },
      returning: true,
    });
  }
  delete(id: string): Promise<number> {
    return this.popUpModel.destroy({ where: { id: id } });
  }
  create(payload: any): Promise<PopUpModel> {
    return this.popUpModel.create(payload);
  }
  findById(id: string): Promise<PopUpModel> {
    return this.popUpModel.findByPk(id);
  }
  countByCondition(condition: any): Promise<number> {
    return this.popUpModel.count({
      where: {
        ...condition,
      }
    });
  }
}
