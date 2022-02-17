import { Warrior } from './warrior/warrior';

import { Knight } from './warrior/knight';
import { Thief } from './warrior/thief';
import { Wizard } from './warrior/wizard';
import { Injectable } from '@nestjs/common';

//breakpoints for randomness
const WIZARD_CHANCE = 0.33;
const THIEF_CHANCE = 0.66;
const DISASTER_CHANCE = 0.5;
const DISASTER_RANGE = [7, 11];
@Injectable()
export class AppService {
  // constructor() {}

  // function that returns the battle report
  async getBattle(army1: number, army2: number): Promise<string[]> {
    const battleReport = await this.calculateBattle(army1, army2);
    return battleReport;
  }

  // function that fills both armies with appropriate number of warrior classes
  async armyCalculator(armyLength: number) {
    const army: Warrior[] = [];
    for (let index = 0; index < armyLength; index++) {
      const chance = Math.random();

      const wizard = new Wizard();
      const knight = new Knight();
      const thief = new Thief();
      if (chance <= WIZARD_CHANCE) {
        army.push(wizard);
      } else if (chance > WIZARD_CHANCE && chance <= THIEF_CHANCE) {
        army.push(thief);
      } else if (chance > THIEF_CHANCE) {
        army.push(knight);
      }
    }
    return army;
  }
  // function that generates a disaster every 5 rounds
  generateDisaster = (index: number, disasterModulo: number): number => {
    if ((index + 1) % disasterModulo === 0) {
      const disasterChance = Math.random();
      if (disasterChance > DISASTER_CHANCE) {
        return 1;
        //1 signifies an earthquake
      } else {
        return 2;
        //2 signifies a disease
      }
    }
  };

  // main function with all the battle logic
  async calculateBattle(army1num: number, army2num: number): Promise<string[]> {
    const firstArmy = await this.armyCalculator(army1num);
    const secondArmy = await this.armyCalculator(army2num);

    const smallArmy =
      firstArmy.length > secondArmy.length ? secondArmy : firstArmy;
    const bigArmy =
      firstArmy.length > secondArmy.length ? firstArmy : secondArmy;

    const battleLog: string[] = [];
    let diedOfDisaster = 0;
    let diedOfCombat = 0;
    let round = 1;
    battleLog.push(
      `The battle has begun! Bigger army has ${bigArmy.length} warriors. Smaller army has ${smallArmy.length} warriors`,
    );
    while (smallArmy.length !== 0 && bigArmy.length !== 0) {
      for (let indexBig = 0; indexBig < bigArmy.length; indexBig++) {
        const element1 = bigArmy[indexBig];

        for (let indexSmall = 0; indexSmall < smallArmy.length; indexSmall++) {
          const disasterModulo =
            Math.floor(
              Math.random() * (DISASTER_RANGE[0] - DISASTER_RANGE[1] + 1),
            ) + DISASTER_RANGE[1];
          const peopleKilled = Math.floor(Math.random() * (1 - 20 + 1)) + 20;
          const disaster = this.generateDisaster(indexSmall, disasterModulo);

          const attackOrder = Math.random();
          const element = smallArmy[indexSmall];
          if (attackOrder > 0.5) {
            if (disaster === 1) {
              bigArmy.splice(indexBig, peopleKilled);
              battleLog.push(
                `A disaster happened! An earthquake hit the bigger army. ${peopleKilled} were killed. Bigger army has ${bigArmy.length} warriors left`,
              );
              diedOfDisaster += peopleKilled;
            } else if (disaster === 2) {
              bigArmy.splice(indexBig, peopleKilled);
              battleLog.push(
                `A disaster happened! A disease struck the bigger army. ${peopleKilled} were killed. Bigger army has ${bigArmy.length} warriors left`,
              );
              diedOfDisaster += peopleKilled;
            } else {
              const isDead = element.attack(element1);
              if (isDead) {
                bigArmy.splice(indexBig, 1);
                diedOfCombat += 1;
                battleLog.push(
                  `${element1.type} of the bigger army died in combat. Bigger army has ${bigArmy.length} warriors left`,
                );
              }
            }
          } else {
            if (disaster === 1) {
              smallArmy.splice(indexSmall, peopleKilled);
              battleLog.push(
                `A disaster happened! An earthquake hit the smaller army. ${peopleKilled} were killed. Smaller army has ${smallArmy.length} warriors left`,
              );
              diedOfDisaster += peopleKilled;
            } else if (disaster === 2) {
              smallArmy.splice(indexSmall, peopleKilled);
              battleLog.push(
                `A disaster happened! A disease struck the smaller army. ${peopleKilled} were killed. Smaller army has ${smallArmy.length} warriors left`,
              );
              diedOfDisaster += peopleKilled;
            } else {
              const isDead = element1.attack(element);
              if (isDead) {
                smallArmy.splice(indexSmall, 1);
                battleLog.push(
                  `A ${element.type} of the smaller army died in combat. Smaller army has ${smallArmy.length} warriors left`,
                );
                diedOfCombat += 1;
              }
            }
          }

          if (bigArmy.length === 0 || smallArmy.length === 0) {
            battleLog.push(
              `The battle has ended after ${round} rounds of fighting ${
                bigArmy.length === 0
                  ? `The smaller army won with ${smallArmy.length} warriors left`
                  : `The bigger army won with ${bigArmy.length} warriors left`
              } `,
            );
            break;
          }
          if (indexSmall === smallArmy.length - 1) {
            battleLog.push(
              `Battle status at the end of round ${round}: Bigger army has ${
                bigArmy.length
              } warriors left. Smaller army has ${
                smallArmy.length
              } warriors left. Warriors that died this round ${
                diedOfCombat + diedOfDisaster
              }`,
            );
            diedOfCombat = 0;
            diedOfDisaster = 0;
            round += 1;
          }
        }
      }
    }
    return battleLog;
    //an array with the logs of battle
  }
}
