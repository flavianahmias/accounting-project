import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.services';
import { UserFromTransaction, UserService } from '../user/user.services';
import { TransactionType } from './transaction.entity';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  /**
   * This route serves to fetch all transactions
   * @returns all transactions
   */
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  /**
   * This route serves to insert receive a text file and insert the data in the database
   * @returns created status
   */
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createFromFile(@UploadedFile() file: Express.Multer.File) {
    //Read transaction file
    const transcriptedTransactions =
      this.transactionService.readTransactionFile(file);

    //Get users in the transaction file
    const usersFromFile = await this.transactionService.getUsersFromFile(
      transcriptedTransactions,
    );

    //Add missing users
    const missingUsers: UserFromTransaction[] = [];
    const promises = usersFromFile.map((u) =>
      this.transactionService.isActiveUser(u.username).then((found) => {
        if (!found) missingUsers.push(u);
      }),
    );

    await Promise.all(promises);

    await this.userService.createUsers(missingUsers);

    //Create transactions
    const createdTransactions =
      await this.transactionService.createTransactions(
        transcriptedTransactions,
      );

    //Update users balance
    for (const transaction of createdTransactions) {
      switch (transaction.type) {
        case TransactionType.ReceivedComission:
        case TransactionType.CreatorSell:
          await this.userService.changeBalanceToUser(
            transaction.seller.id,
            transaction.value,
          );
          break;
        case TransactionType.PaidComission:
          await this.userService.changeBalanceToUser(
            transaction.seller.id,
            -transaction.value,
          );
          break;
        case TransactionType.AffiliateSell:
          if (transaction.seller.creator)
            await this.userService.changeBalanceToUser(
              transaction.seller.creator.id,
              transaction.value,
            );
      }
    }
  }

  /**
   * This route serves to search for a transaction by ID
   * @param id transaction ID
   * @returns  transaction
   */
  @Get('/:id')
  async getTransaction(@Param('id') id: number) {
    return this.transactionService.getTransactionById(id);
  }
}
