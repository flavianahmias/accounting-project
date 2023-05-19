import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TransactionService } from './transaction.services';
import { transactionProviders } from './transaction.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...transactionProviders, TransactionService],
})
export class TransactionModule {}
