import { BattleQuery } from './query-interface';
import { Knight } from './warrior/knight';
import { Thief } from './warrior/thief';
import { Wizard } from './warrior/wizard';
import { Injectable } from '@nestjs/common';
import { Console } from 'console';

@Injectable()
export class AppService {
  constructor(
    private thief: Thief,
    private wizard: Wizard,
    private knight: Knight,
  ) {}

  async getBattle(army1: number, army2: number): Promise<string> {
    this.calculateBattle(army1, army2);
    const chance = Math.random();
    let pickedWarrior = 0;
    if (chance > 0.85) {
      pickedWarrior = Math.round(Math.random());
      return `Army number 1: ${army1} versus Army number 2: ${army2} Affected warrior from the ${
        pickedWarrior === 0 ? 'first army' : 'second army'
      }`;
    } else {
      return 'Regular battle';
    }
  }

  async calculateBattle(army1num: number, army2num: number): Promise<void> {
    const army1array: Array<any> = [];
    const army2array: Array<any> = [];

    //range za raspodjelu vojnika

    for (let index = 0; index < army1num; index++) {
      const chance = Math.random();
      if (chance <= 0.33) {
        //konstata a ne bosanska hardkdirana vrijednost
        army1array.push(this.wizard);
      } else if (chance > 0.33 && chance <= 0.66) {
        army1array.push(this.thief);
      } else if (chance > 0.66) {
        army1array.push(this.knight);
      }
    }
    for (let index = 0; index < army1array.length; index++) {
      const warrior = new Knight();
    }
    const smallArmy =
      army1array.length > army2array.length ? army2array : army1array;
    const bigArmy = null; //obrnuto

    //provjeriti vojnike
    //logirati runde
    //generator disease
    while (true) {
      for (let index = 0; index < bigArmy.length; index++) {
        const element1 = bigArmy[index];

        for (let index = 0; index < smallArmy.length; index++) {
          const element = army2array[index];

          const isDead = element.attack(element1);
          if (isDead) {
            army2array.slice(index, 1);
          }
          //implementirati bitku
        }
      }
    }

    for (let index = 0; index < army2num; index++) {
      const chance = Math.random();
      if (chance <= 0.33) {
        army2array.push(this.wizard);
      } else if (chance > 0.33 && chance <= 0.66) {
        army2array.push(this.thief);
      } else if (chance > 0.66) {
        army2array.push(this.knight);
      }
    }
    console.log(army1array, army2array);
  }
  async warriorAttack(
    attackerPower: number,
    defenderArmor: number,
  ): Promise<number> {
    const armorMultiplicator = 1 - defenderArmor / 200;
    return attackerPower * armorMultiplicator;
  }
}
