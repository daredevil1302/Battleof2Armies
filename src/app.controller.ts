import { BattleQuery } from './query-interface';
import { Wizard } from './warrior/wizard';
import { Thief } from './warrior/thief';
import { Knight } from './warrior/knight';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/battle')
  async getBattle(@Query() battleQuery: BattleQuery): Promise<string> {
    const { army1, army2 } = battleQuery;
    return this.appService.getBattle(army1, army2);
  }
}
