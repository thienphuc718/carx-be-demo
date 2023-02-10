import { Module } from "@nestjs/common";
import { BookingModule } from "../../bookings/module/BookingModule";
import { CurlModule } from "../../curl/module/CurlModule";
import { CustomerModule } from "../../customers/module";
import { OrderModule } from "../../orders/module/OrderModule";
import { TransactionModule } from "../../transactions/module/TransactionModule";
import { PaymentController } from "../controller/PaymentController";
import { MoMoPaymentServiceImplementation } from "../service/momo/MoMoPaymentServiceImplementation";
import { IMoMoPaymentService } from "../service/momo/MoMoPaymentServiceInterface";
import { PaymentServiceImplementation } from "../service/PaymentServiceImplementation";
import { IPaymentService } from "../service/PaymentServiceInterface";

@Module({
    imports: [OrderModule, CustomerModule, TransactionModule, CurlModule, BookingModule],
    providers: [
        {
            provide: IPaymentService,
            useClass: PaymentServiceImplementation
        },
        {
            provide: IMoMoPaymentService,
            useClass: MoMoPaymentServiceImplementation,
        }
    ],
    controllers: [PaymentController]
})
export class PaymentModule {}