import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [DatabaseModule, DictionaryModule],
  providers: [AppService],
})
export class AppModule {}
