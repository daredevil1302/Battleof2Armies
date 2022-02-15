import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BattleQuery {
  @IsPositive()
  army1: number;
  @IsPositive()
  army2: number;
}
