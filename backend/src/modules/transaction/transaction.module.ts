import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { transactionProviders } from './transaction.providers';
import { TransactionService } from './transaction.services';

@Module({
  imports: [DatabaseModule],
  providers: [...transactionProviders, TransactionService],
})
export class PhotoModule {}
