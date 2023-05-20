import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [TransactionModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
