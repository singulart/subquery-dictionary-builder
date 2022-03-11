
import { Module } from '@nestjs/common';
import { providers } from './dictionary.providers';


@Module({
  providers: [...providers],
})
export class DictionaryModule { }
