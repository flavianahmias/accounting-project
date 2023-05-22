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

  /**
   * This function find all transactions in database
   * @returns all transactions in database
   */
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  /**
   * This function save transactions in database
   * @returns 201 status code
   */
  async saveTransaction(transaction: Transaction) {
    return this.transactionRepository.create(transaction);
  }

  /**
   * This function read the text file and return the array
   * with all transactions in object format
   * @returns transactions array
   */
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

  /**
   * This function recognizes each user of the transitions
   * and according to his position adds the correct keys.
   * @param fileTransactions
   * @returns
   */
  async getUsersFromFile(
    fileTransactions: FileTransaction[],
  ): Promise<UserFromTransaction[]> {
    const usersFromTransaction: UserFromTransaction[] = [];
    const verifiedUsers: string[] = [];

    fileTransactions
      .filter((f) => {
        //Verify that the seller already exists in the database
        if (verifiedUsers.includes(f.seller)) {
          return false;
        } else {
          verifiedUsers.push(f.seller);
          return true;
        }
      })
      .forEach((fileTransaction) => {
        //If the transaction is from a creator that does not exist in the database, it creates a user of the creator type.
        switch (fileTransaction.type) {
          case 1:
          case 3:
            usersFromTransaction.push({
              role: Role.Creator,
              username: fileTransaction.seller,
              balance: fileTransaction.value,
            });
            break;

          case 2:
          case 4:
            // Searches if there is a creator of this transaction based on the product name
            // if it exists, it means that the transaction is from an affiliate,
            const creator = fileTransactions.find(
              (f) =>
                f.product === fileTransaction.product &&
                [1, 3].includes(f.type),
            );

            if (creator) {
              // Creates a user of type affiliate with a reference to its creator.
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

  /**
   * This function checks if the user already exists in the database.
   * @param username user name
   * @returns if the user exists in the database
   */
  async isActiveUser(username: string) {
    const foundUser = await this.userRepository.findOne({
      where: { name: username },
    });

    return !!foundUser;
  }

  /**
   * This function creates a transaction object in the database
   * @param transactionFile transaction object
   * @returns transactions new object with the seller
   *
   */
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

  /**
   * TThis function goes through all existing transactions and creates each one in the database
   * @param transactions transactions array
   * @returns transactions array
   */
  async createTransactions(transactions: FileTransaction[]) {
    const createdTransactions: Transaction[] = [];
    for (let transaction of transactions) {
      let created = await this.createTransaction(transaction);
      createdTransactions.push(created);
    }

    return createdTransactions;
  }

  /**
   * This function searches for the transaction by id
   * @param id transaction id
   * @returns transaction
   */
  async getTransactionById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOneOrFail({
      where: { id },
      relations: ['seller', 'seller.creator'],
    });
  }
}
