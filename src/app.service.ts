import { Warrior } from './warrior/warrior';
import { BattleQuery } from './query-interface';
import { Knight } from './warrior/knight';
import { Thief } from './warrior/thief';
import { Wizard } from './warrior/wizard';
import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { stringify } from 'querystring';

const WIZARD_CHANCE = 0.33;
const THIEF_CHANCE = 0.66;
const DISASTER_CHANCE = 0.5;
@Injectable()
export class AppService {
  constructor(
    private thief: Thief,
    private wizard: Wizard,
    private knight: Knight,
  ) {}

  async getBattle(army1: number, army2: number): Promise<string> {
    await this.calculateBattle(army1, army2);
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

  async armyCalculator(armyLength: number) {
    const army: Warrior[] = [];
    for (let index = 0; index < armyLength; index++) {
      const chance = Math.random();
      if (chance <= WIZARD_CHANCE) {
        //konstata a ne bosanska hardkdirana vrijednost
        army.push(this.wizard);
      } else if (chance > WIZARD_CHANCE && chance <= THIEF_CHANCE) {
        army.push(this.thief);
      } else if (chance > THIEF_CHANCE) {
        army.push(this.knight);
      }
    }
    return army;
  }
  generateDisease = (index: number): number => {
    if (index % 5 === 0) {
      const diseaseChance = Math.random();
      if (diseaseChance > DISASTER_CHANCE) {
        return 1;
        //1 signifies an earthquake
      } else {
        return 2;
        // signifies a disease
      }
    }
  };
  async calculateBattle(army1num: number, army2num: number): Promise<string[]> {
    const firstArmy = await this.armyCalculator(army1num);
    const secondArmy = await this.armyCalculator(army2num);

    const smallArmy =
      firstArmy.length > secondArmy.length ? secondArmy : firstArmy;
    const bigArmy =
      firstArmy.length > secondArmy.length ? firstArmy : secondArmy;
    const battleLog: string[] = [];

    while (smallArmy.length !== 0 || bigArmy.length !== 0) {
      for (let indexBig = 0; indexBig < bigArmy.length; indexBig++) {
        const element1 = bigArmy[indexBig];

        for (let indexSmall = 0; indexSmall < smallArmy.length; indexSmall++) {
          const peopleKilled = Math.floor(Math.random() * (1 - 5 + 1)) + 5;
          const disaster = this.generateDisease(indexSmall);
          let diedOfDisaster = 0;
          let diedOfCombat = 0;
          const attackOrder = Math.random();
          const element = smallArmy[indexSmall];
          if (attackOrder > 0.5) {
            if (disaster === 1) {
              bigArmy.slice(indexBig, peopleKilled);
              battleLog.push(
                `A disaster happened in round ${indexSmall}! An earthquake hit the bigger army. ${peopleKilled} were killed`,
              );
              diedOfDisaster += peopleKilled;
            } else if (disaster === 2) {
              bigArmy.slice(indexBig, peopleKilled);
              battleLog.push(
                `A disaster happened in round ${indexSmall}! A disease struck the bigger army. ${peopleKilled} were killed`,
              );
              diedOfDisaster += peopleKilled;
            } else {
              const isDead = element.attack(element1);
              if (isDead) {
                bigArmy.slice(indexBig, 1);
                diedOfCombat += 1;
              }
            }
          } else {
            if (disaster === 1) {
              smallArmy.slice(indexSmall, peopleKilled);
              battleLog.push(
                `A disaster happened in round ${indexSmall}! An earthquake hit the smaller army. ${peopleKilled} were killed`,
              );
              diedOfDisaster += peopleKilled;
            } else if (disaster === 2) {
              smallArmy.slice(indexSmall, peopleKilled);
              battleLog.push(
                `A disaster happened in round ${indexSmall}! A disease struck the smaller army. ${peopleKilled} were killed`,
              );
              diedOfDisaster += peopleKilled;
            } else {
              const isDead = element1.attack(element);
              if (isDead) {
                smallArmy.slice(indexSmall, 1);
                diedOfCombat += 1;
              }
            }
          }
          if (indexSmall % 5 === 0) {
            battleLog.push(
              `Battle status after ${indexSmall} attacks: 
              -The bigger army has ${bigArmy.length} warriors left. 
              -The smaller army has ${smallArmy.length} left. 
              -${diedOfCombat} warriors died in single combat on both sides. 
              -${diedOfDisaster} warriors died of disasters (earthquakes and diseases) on both sides`,
            );
          }
          if (bigArmy.length === 0 || smallArmy.length === 0) {
            battleLog.push(
              `The battle has ended! ${
                bigArmy.length === 0
                  ? `The smaller army won with ${smallArmy.length} warriors left`
                  : `The bigger army won with ${bigArmy.length} warriors left`
              } `,
            );
          }
        }
      }
    }
    return battleLog;
  }
}
