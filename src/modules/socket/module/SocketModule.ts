import { Module, Global } from '@nestjs/common';
import { SocketService } from '../service/SocketService';

@Global()
@Module({
  controllers: [],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
