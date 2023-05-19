import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionByUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        seller: {
          id: userId,
        },
      },
    });
  }
}
