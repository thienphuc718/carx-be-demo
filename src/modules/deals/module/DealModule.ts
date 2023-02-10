import {forwardRef, Module} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from '../../../models';
import { DealModel } from '../../../models/Deals';
import { ProductModule } from '../../products/module';
import { DealController } from '../controller/DealController';
import { DealRepositoryImplementation } from '../repository/DealRepositoryImplementation';
import { IDealRepository } from '../repository/DealRepositoryInterface';
import { DealServiceImplementation } from '../service/DealServiceImplementation';
import { IDealService } from '../service/DealServiceInterface';
import {SectionDealRelationModule} from "../../sections/section-deal-relation/module/SectionDealRelationModule";

@Module({
  imports: [SequelizeModule.forFeature([DealModel, ProductModel]), forwardRef(() => ProductModule), forwardRef(() => SectionDealRelationModule)],
  providers: [
    {
      provide: IDealRepository,
      useClass: DealRepositoryImplementation,
    },
    {
      provide: IDealService,
      useClass: DealServiceImplementation,
    },
  ],
  exports: [IDealService],
  controllers: [DealController],
})
export class DealModule {}
