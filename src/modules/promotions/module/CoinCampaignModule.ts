import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoinCampaignModel } from '../../../models';
import { CoinCampaignController } from '../controller/CoinCampaignController';
import { ICoinCampaignRepository } from '../repository/coin-campaign/CoinCampaignRepositoryInterface';
import { CoinCampaignRepositoryImplementation } from '../repository/coin-campaign/CoinCampaignRepositoryImplementation';
import { CoinCampaignServiceImplementation } from '../service/coin-campaign/CoinCampaignServiceImplementation';
import { ICoinCampaignService } from '../service/coin-campaign/CoinCampaignServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([CoinCampaignModel])],
  providers: [
    {
      provide: ICoinCampaignRepository,
      useClass: CoinCampaignRepositoryImplementation,
    },
    {
      provide: ICoinCampaignService,
      useClass: CoinCampaignServiceImplementation,
    },
  ],
  controllers: [CoinCampaignController],
})
export class CoinCampaignModule {}
