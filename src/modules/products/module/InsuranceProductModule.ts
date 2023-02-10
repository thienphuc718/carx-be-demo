import {forwardRef, Module} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsuranceProductModel } from '../../../models/InsuranceProducts';
import { InsuranceProductRepositoryInterface } from '../repository/insurance-products/InsuranceProductRepositoryInterface';
import { InsuranceProductRepositoryImplementation } from '../repository/insurance-products/InsuranceProductRepositoryImplementation';
import { InsuranceProductServiceInterface } from '../service/insurance-products/InsuranceProductServiceInterface';
import { InsuranceProductServiceImplementation } from '../service/insurance-products/InsuranceProductServiceImplementation';
import {ProductModule} from "./ProductModule";

@Module({
  imports: [SequelizeModule.forFeature([InsuranceProductModel]), forwardRef(() => ProductModule)],
  providers: [
    {
      provide: InsuranceProductRepositoryInterface,
      useClass: InsuranceProductRepositoryImplementation,
    },
    {
      provide: InsuranceProductServiceInterface,
      useClass: InsuranceProductServiceImplementation,
    },
  ],
  exports: [InsuranceProductServiceInterface],
})
export class InsuranceProductModule {}