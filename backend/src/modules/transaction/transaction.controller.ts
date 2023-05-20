import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.services';
import { UserService } from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

    const missingUsernames = await this.transactionService.getMissingUsers(
      transcriptedTransactions.map((t) => t.seller),
    );

    await this.userService.createUsers(missingUsernames);
    // await this.transactionService.createTransactions(transcriptedTransactions);
  }
}
