import { Injectable, Inject, UploadedFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';

enum SellType {
  ProductorSell = 1,
  AffiliateSell,
  PaidComission,
  ReceivedComission,
}

interface FileTransaction {
  type: SellType;
  date: Date;
  product: string;
  seller: string;
  value: number;
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
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

  async saveTransaction(transaction: Transaction) {
    return this.transactionRepository.create(transaction);
  }

  readTransactionFile(
    @UploadedFile() file: Express.Multer.File,
  ): FileTransaction[] {
    console.log(file);
    return [];
  }

  async getMissingUsers(usernames: string[]): Promise<string[]> {
    const users = await this.userRepository.find();
    return usernames.filter((username) =>
      users.some((u) => u.name === username),
    );
  }

  async createTransaction(transactionFile: FileTransaction) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        name: transactionFile.seller,
      },
    });

    const transaction = new Transaction({
      date: transactionFile.date,
      seller: user,
      product: transactionFile.product,
      value: transactionFile.value,
    });

    return this.transactionRepository.save(transaction);
  }

  async createTransactions(transactions: FileTransaction[]) {
    return transactions.map(async (t) => await this.createTransaction(t));
  }
}
