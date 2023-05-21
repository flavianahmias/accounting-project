import { Injectable, Inject, UploadedFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionType, Transaction } from './transaction.entity';
import { Role, User } from '../user/user.entity';
import { UserFromTransaction } from '../user/user.services';

interface FileTransaction {
  type: TransactionType;
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
              role: Role.Creator,
              username: fileTransaction.seller,
              balance: fileTransaction.value,
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
      relations: ['creator'],
    });

    const transaction = new Transaction({
      date: transactionFile.date,
      seller: user,
      type: transactionFile.type,
      product: transactionFile.product,
      value: transactionFile.value,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async createTransactions(transactions: FileTransaction[]) {
    const createdTransactions: Transaction[] = [];
    for (let transaction of transactions) {
      let created = await this.createTransaction(transaction);
      createdTransactions.push(created);
    }

    return createdTransactions;
  }

  async getTransactionById(id: number) {
    return this.transactionRepository.findOne({
      where: { id },
    });
  }
}
