import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [DatabaseModule, DictionaryModule],
})
export class AppModule {}
