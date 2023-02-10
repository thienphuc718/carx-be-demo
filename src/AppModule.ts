import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { CustomerClassModule } from './modules/customers/module/CustomerClass';
import { CustomerCategoryModule } from './modules/customers/module/CustomerCategory';
import { AppController } from './AppController';
import { DatabaseModule } from './modules/databases/DatabaseModule';
import { UserModule } from './modules/users/module/UserModule';
import { AuthModule } from './modules/auth/module/AuthModule';
import { RoleModule } from './modules/roles/module/RoleModule';
import { StaffModule } from './modules/staffs/module/StaffModule';
import { SmsModule } from './modules/sms/module/SmsModule';
import { EmailModule } from './modules/email/module/EmailModule';
import { CityModule } from './modules/location/module/CityModule';
import { DistrictModule } from './modules/location/module/DistrictModule';
import { TenancyModule } from './modules/tenancy/TenancyModule';
import { TaskModule } from './tasks/TaskModule';
import { ProductModule } from './modules/products/module/ProductModule';
import { ProductBrandModule } from './modules/products/module/ProductBrandModule';
import { ProductCategoryModule } from './modules/products/module/ProductCategoryModule';
import { ProductAttributeModule } from './modules/products/module/ProductAttributeModule';
import { ProductVariantModule } from './modules/products/module/ProductVariantModule';
import { CustomerModule } from './modules/customers/module/Customer';
import { CustomerClubModule } from './modules/customers/module/CustomerClub';
import { PostModule } from './modules/posts/module/PostModule';
import { PostTagModule } from './modules/posts/module/PostTagModule';
import { PostCategoryModule } from './modules/posts/module/PostCategoryModule';

import { OrderModule } from './modules/orders/module/OrderModule';
import { OrderItemModule } from './modules/orders/module/OrderItemModule';

import { CurlModule } from './modules/curl/module/CurlModule';
import { CompanyModule } from './modules/companies/module/CompanyModule';

import { CoinCampaignModule } from './modules/promotions/module/CoinCampaignModule';
import { CoinConfigModule } from './modules/promotions/module/CoinConfigModule';
import { GiftModule } from './modules/promotions/module/GiftModule';
import { PromotionModule } from './modules/promotions/module/PromotionModule';
import { PromotionApplyModule } from './modules/promotions/module/PromotionApplyModule';
import { PromotionConfigModule } from './modules/promotions/module/PromotionConfigModule';
import { ReferralLinkModule } from './modules/promotions/module/ReferralLinkModule';

import { FileModule } from './modules/files/module/FileModule';
import { ServiceModule } from './modules/services/module/ServiceModule';
import { ServiceCategoryModule } from './modules/services/module/ServiceCategoryModule';
import { CallModule } from './modules/call/module/CallModule';
import { AgentModule } from './modules/agents/module/AgentModule';

import { CarModule } from './modules/cars/module/CarModule';
import { ServiceTemplateModule } from './modules/services/module/ServiceTemplateModule';
import { ReviewModule } from './modules/review/module/ReviewModule';
import { ForbiddenKeywordModule } from './modules/forbidden-keywords/module/ForbiddenKeywordModule';

import { BookingModule } from './modules/bookings/module/BookingModule';
import { ServiceCategoryRelationModule } from './modules/services/module/ServiceCategoryRelationModule';
import { ActivityModule } from './modules/activities/module/ActivityModule';
import { DealModule } from './modules/deals/module/DealModule';

import { AppGateway } from './gateway/AppGateway';
import { EventHandlerModule } from './event-handler/EventHandlerModule';
import { SocketModule } from './modules/socket/module/SocketModule';
import { FlashBuyRequestModule } from './modules/flash-buy-requests/module/FlashBuyRequestModule';
import { FlashBuyResponseModule } from './modules/flash-buy-requests/module/FlashBuyResponseModule';
import { GoongModule } from './modules/goongapi/module/GoongModule';
import { StaffReportModule } from './modules/staff-report/module/StaffReportModule';
import { OnsiteRescueRequestModule } from './modules/onsite-rescues/module/OnsiteRescueRequestModule';
import { OnsiteRescueResponseModule } from './modules/onsite-rescues/module/OnsiteRescueResponseModule';
import { CommentModule } from './modules/comments/module/CommentModule';
import { ChatMessageModule } from './modules/chat/module/ChatMessageModule';
import { ChatConversationModule } from './modules/chat/module/ChatConversationModule';
import { NotificationModule } from './modules/notifications/module/NotificationModule';
import { AgentCategoryModule } from './modules/agent-categories/module/AgentCategoryModule';
import { SystemConfigurationModule } from './modules/system-configurations/module/SystemConfigurationModule';
import { FeatureModule } from './modules/features/module/FeatureModule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LikeModule } from './modules/likes/module/LikeModule';
import { SliderModule } from './modules/sliders/module/SliderModule';
import { PopUpModule } from './modules/pop-ups/module/PopUpModule';
import { SectionModule } from './modules/sections/sections/module/SectionModule';
import { SectionAgentRelationModule } from './modules/sections/section-agent-relation/module/SectionAgentRelationModule';
import { SectionPromotionRelationModule } from './modules/sections/section-promotion-relation/module/SectionPromotionRelationModule';
import { SectionProductRelationModule } from './modules/sections/section-product-relation/module/SectionProductRelationModule';
import { SectionDealRelationModule } from './modules/sections/section-deal-relation/module/SectionDealRelationModule';
import { SectionPostRelationModule } from './modules/sections/section-post-relation/module/SectionPostRelationModule';
import { TransactionModule } from './modules/transactions/module/TransactionModule';
import { PaymentModule } from './modules/payments/module/PaymentModule';

import { TrailerRescueRequestModule } from './modules/trailer-rescues/module/TrailerRescueRequestModule';
import { TrailerFormerRescueResponseModule } from './modules/trailer-rescues/module/TrailerFormerRescueResponseModule';
import { TrailerLaterRescueResponseModule } from './modules/trailer-rescues/module/TrailerLaterRescueResponseModule';
import { RecommendedKeywordModule } from './modules/reommended-keywords/module/RecommendedKeywordModule';
import {InsuranceProductModule} from "./modules/products/module";
import {InsuranceContractModule} from "./modules/insurance-contracts/module/InsuranceContractModule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TaskModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SocketModule,
    AppGateway,
    EventEmitterModule.forRoot(),
    EventHandlerModule,
    UserModule,
    RoleModule,
    AuthModule,
    SmsModule,
    EmailModule,
    TenancyModule,
    ProductModule,
    ProductBrandModule,
    ProductCategoryModule,
    ProductAttributeModule,
    ProductVariantModule,
    CityModule,
    DistrictModule,
    CustomerCategoryModule,
    CustomerClassModule,
    CustomerClubModule,
    CustomerModule,
    PostModule,
    PostTagModule,
    PostCategoryModule,
    OrderModule,
    OrderItemModule,
    CoinCampaignModule,
    CoinConfigModule,
    GiftModule,
    PromotionModule,
    PromotionApplyModule,
    PromotionConfigModule,
    ReferralLinkModule,
    FileModule,
    CurlModule,
    CompanyModule,
    ServiceTemplateModule,
    ServiceModule,
    ServiceCategoryModule,
    CallModule,
    AgentModule,
    CarModule,
    ReviewModule,
    ForbiddenKeywordModule,
    BookingModule,
    StaffModule,
    ServiceCategoryRelationModule,
    ActivityModule,
    DealModule,
    FlashBuyRequestModule,
    FlashBuyResponseModule,
    GoongModule,
    StaffReportModule,
    OnsiteRescueRequestModule,
    OnsiteRescueResponseModule,
    CommentModule,
    ChatMessageModule,
    ChatConversationModule,
    NotificationModule,
    AgentCategoryModule,
    SystemConfigurationModule,
    FeatureModule,
    LikeModule,
    SliderModule,
    PopUpModule,
    SectionModule,
    SectionAgentRelationModule,
    SectionPromotionRelationModule,
    SectionProductRelationModule,
    SectionDealRelationModule,
    SectionPostRelationModule,
    TransactionModule,
    PaymentModule,
    TrailerRescueRequestModule,
    TrailerFormerRescueResponseModule,
    TrailerLaterRescueResponseModule,
    RecommendedKeywordModule,
    InsuranceProductModule,
    InsuranceContractModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
