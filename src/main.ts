import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DictionaryService } from './dictionary/dictionary.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
  const dictionaryService = app.get(DictionaryService)
  await dictionaryService.buildDictionary();
}
bootstrap();
