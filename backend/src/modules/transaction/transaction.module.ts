import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TransactionService } from './transaction.services';
import { transactionProviders } from './transaction.providers';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [TransactionController],
  providers: [...transactionProviders, ...userProviders, TransactionService],
})
export class TransactionModule {}
