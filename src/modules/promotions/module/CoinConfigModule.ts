import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoinConfigModel } from '../../../models';
import { CoinConfigController } from '../controller/CoinConfigController';
import { CoinConfigRepositoryImplementation } from '../repository/coin-config/CoinConfigRepositoryImplementation';
import { ICoinConfigRepository } from '../repository/coin-config/CoinConfigRepositoryInterface';
import { CoinConfigServiceImplementation } from '../service/coin-config/CoinConfigServiceImplementation';
import { ICoinConfigService } from '../service/coin-config/CoinConfigServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([CoinConfigModel])],
  providers: [
    {
      provide: ICoinConfigRepository,
      useClass: CoinConfigRepositoryImplementation,
    },
    {
      provide: ICoinConfigService,
      useClass: CoinConfigServiceImplementation,
    },
  ],
  controllers: [CoinConfigController],
})
export class CoinConfigModule {}
