import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CustomerAgentRelationsModel } from "../../../models";
import { CustomerAgentRelationRepositoryImplementation } from "../repository/customer-agent-relations/CustomerAgentRelationRepositoryImplementation";
import { ICustomerAgentRelationRepository } from "../repository/customer-agent-relations/CustomerAgentRelationRepositoryInterface";

@Module({
    imports: [SequelizeModule.forFeature([CustomerAgentRelationsModel])],
    providers: [
        {
            provide: ICustomerAgentRelationRepository,
            useClass: CustomerAgentRelationRepositoryImplementation
        }
    ],
    exports: [ICustomerAgentRelationRepository]
})
export class CustomerAgentRelationModule {}