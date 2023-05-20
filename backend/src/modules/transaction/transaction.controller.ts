import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.services';
import { UserFromTransaction, UserService } from '../user/user.service';
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
    // await this.transactionService.createTransactions(transcriptedTransactions);
  }
}
