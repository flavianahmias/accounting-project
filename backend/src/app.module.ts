import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionService } from './modules/transaction/transaction.services';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TransactionService],
})
export class AppModule {}
