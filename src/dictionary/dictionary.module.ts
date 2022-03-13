
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { providers } from './dictionary.providers';
import { DictionaryService } from './dictionary.service';


@Module({
  imports: [DatabaseModule],
  providers: [DictionaryService, ...providers],
})
export class DictionaryModule { }
