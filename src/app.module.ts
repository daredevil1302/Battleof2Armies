import { Knight } from './warrior/knight';
import { Wizard } from './warrior/wizard';
import { Thief } from './warrior/thief';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Thief, Wizard, Knight],
})
export class AppModule {}
