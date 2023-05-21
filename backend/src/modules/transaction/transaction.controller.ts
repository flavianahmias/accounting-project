import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.services';
import { UserFromTransaction, UserService } from '../user/user.services';
import { TransactionType } from './transaction.entity';
import { Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createFromFile(@UploadedFile() file: Express.Multer.File) {
    const transcriptedTransactions =
      this.transactionService.readTransactionFile(file);

    const usersFromFile = await this.transactionService.getUsersFromFile(
      transcriptedTransactions,
    );

    const missingUsers: UserFromTransaction[] = [];
    const promises = usersFromFile.map((u) =>
      this.transactionService.isActiveUser(u.username).then((found) => {
        if (!found) missingUsers.push(u);
      }),
    );

    await Promise.all(promises);

    await this.userService.createUsers(missingUsers);

    const createdTransactions =
      await this.transactionService.createTransactions(
        transcriptedTransactions,
      );

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

  @Get('/:id')
  async getTransaction(@Param('id') id: number) {
    const transaction = this.transactionService.getTransactionById(id);

    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.transactionService.getTransactionById(id);
  }
}
