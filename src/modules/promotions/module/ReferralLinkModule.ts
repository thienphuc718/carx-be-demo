import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReferralLinkModel } from '../../../models';
import { ReferralLinkController } from '../controller/ReferralLinkController';
import { IReferralLinkRepository } from '../repository/referral-link/ReferralLinkRepositoryInterface';
import { ReferralLinkRepositoryImplementation } from '../repository/referral-link/ReferralLinkRepositoryImplementation';
import { ReferralLinkServiceImplementation } from '../service/referral-link/ReferralLinkServiceImplementation';
import { IReferralLinkService } from '../service/referral-link/ReferralLinkServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([ReferralLinkModel])],
  providers: [
    {
      provide: IReferralLinkRepository,
      useClass: ReferralLinkRepositoryImplementation,
    },
    {
      provide: IReferralLinkService,
      useClass: ReferralLinkServiceImplementation,
    },
  ],
  controllers: [ReferralLinkController],
})
export class ReferralLinkModule {}
