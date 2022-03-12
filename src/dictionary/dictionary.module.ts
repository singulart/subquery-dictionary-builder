
import { Module } from '@nestjs/common';
import { providers } from './dictionary.providers';
import { DictionaryService } from './dictionary.service';


@Module({
  providers: [DictionaryService, ...providers],
})
export class DictionaryModule { }
