import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TransactionService } from './transaction.services';
import { transactionProviders } from './transaction.providers';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [...transactionProviders, TransactionService],
})
export class TransactionModule {}
