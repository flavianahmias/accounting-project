import { Module } from '@nestjs/common';
import { databaseServices } from './database.services';

@Module({
  providers: [...databaseServices],
  exports: [...databaseServices],
})
export class DatabaseModule {}
