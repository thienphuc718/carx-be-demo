import { AppGateway } from './AppGateway';
import { Module, Global } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class AppGatewayModule {}
