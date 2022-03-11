import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AppService],
})
export class AppModule {}
