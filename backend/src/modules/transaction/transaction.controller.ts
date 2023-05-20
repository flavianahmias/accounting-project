import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { TransactionService } from './transaction.services';
import { UserService } from '../user/user.service';

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

  @Post()
  async createFromFile(@Req() req, @Res() res) {
    const transcriptedTransactions =
      this.transactionService.readTransactionFile(req.file as any);

    const missingUsernames = await this.transactionService.getMissingUsers(
      transcriptedTransactions.map((t) => t.seller),
    );

    await this.userService.createUsers(missingUsernames);
    await this.transactionService.createTransactions(transcriptedTransactions);
    return res.status(200);
  }
}
