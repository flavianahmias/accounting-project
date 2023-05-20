import { Injectable, Inject, UploadedFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Role, User } from '../user/user.entity';
import { UserFromTransaction } from '../user/user.service';

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

  readTransactionFile(file: Express.Multer.File): FileTransaction[] {
    const data = file.buffer.toString();
    const lines = data.split('\n');

    const fileTransactions: FileTransaction[] = lines
      .filter((l) => l.length > 67)
      .map((line) => ({
        type: parseInt(line.substring(0, 1)),
        date: new Date(line.substring(1, 26)),
        product: line.substring(26, 56).trim(),
        value: parseFloat(line.substring(56, 66)),
        seller: line.substring(66, 86).trim(),
      }));

    return fileTransactions;
  }

  async getUsersFromFile(
    fileTransactions: FileTransaction[],
  ): Promise<UserFromTransaction[]> {
    const usersFromTransaction: UserFromTransaction[] = [];
    const verifiedUsers: string[] = [];

    fileTransactions
      .filter((f) => {
        if (verifiedUsers.includes(f.seller)) {
          return false;
        } else {
          verifiedUsers.push(f.seller);
          return true;
        }
      })
      .forEach((fileTransaction) => {
        switch (fileTransaction.type) {
          // Creator
          case 1:
          case 3:
            usersFromTransaction.push({
              role: Role.Productor,
              username: fileTransaction.seller,
            });
            break;

          // Affiliate
          case 2:
          case 4:
            // Find Creator
            // Based on name of product
            const creator = fileTransactions.find(
              (f) =>
                f.product === fileTransaction.product &&
                [1, 3].includes(f.type),
            );

            if (creator) {
              usersFromTransaction.push({
                role: Role.Affiliate,
                username: fileTransaction.seller,
                creatorName: creator.seller,
              });
            }

            break;
        }
      });

    return usersFromTransaction;
  }

  async isActiveUser(username: string) {
    const foundUser = await this.userRepository.findOne({
      where: { name: username },
    });

    return !!foundUser;
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
