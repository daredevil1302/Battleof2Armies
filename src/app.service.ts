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

      if (chance <= WIZARD_CHANCE) {
        const wizard = new Wizard();
        army.push(wizard);
      } else if (chance > WIZARD_CHANCE && chance <= THIEF_CHANCE) {
        const thief = new Thief();
        army.push(thief);
      } else if (chance > THIEF_CHANCE) {
        const knight = new Knight();
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

  //function that calculates the upper limit of people that can die in a disaster
  calculateDeathCap = (army1Length: number, army2Length: number): number => {
    if (army1Length > army2Length) {
      return army2Length - 1;
    } else {
      return army1Length - 1;
    }
  };

  //function that describes what happens when a warrior from small army attacks
  smallArmyAttacker = (
    smallArmyWarrior: Warrior,
    bigArmyWarrior: Warrior,
    disaster: number,
    bigArmy: Warrior[],
    indexBig: number,
    battleLog: string[],
    peopleKilled: number,
  ): number => {
    let diedOfCombat = 0;
    let diedOfDisaster = 0;
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
      const isDead = smallArmyWarrior.attack(bigArmyWarrior);
      if (isDead) {
        bigArmy.splice(indexBig, 1);
        diedOfCombat += 1;
        battleLog.push(
          `${bigArmyWarrior.type} of the bigger army was killed in combat by a ${smallArmyWarrior.type} of the smaller army. Bigger army has ${bigArmy.length} warriors left`,
        );
      }
    }
    return diedOfCombat + diedOfDisaster;
  };
  // function that describes what happens when a warrior from big army attacks
  bigArmyAttacker = (
    smallArmyWarrior: Warrior,
    bigArmyWarrior: Warrior,
    disaster: number,
    smallArmy: Warrior[],
    indexSmall: number,
    battleLog: string[],
    peopleKilled: number,
  ): number => {
    let diedOfCombat = 0;
    let diedOfDisaster = 0;
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
      const isDead = bigArmyWarrior.attack(smallArmyWarrior);
      if (isDead) {
        smallArmy.splice(indexSmall, 1);
        battleLog.push(
          `A ${smallArmyWarrior.type} of the smaller army was killed in combat by a ${bigArmyWarrior.type} of the bigger army. Smaller army has ${smallArmy.length} warriors left`,
        );
        diedOfCombat += 1;
      }
    }
    return diedOfCombat + diedOfDisaster;
  };

  //main battle logic
  battle = (
    battleLog: string[],
    bigArmy: Warrior[],
    smallArmy: Warrior[],
    disaster: number,
    indexBig: number,
    indexSmall: number,
    peopleKilled: number,
  ): number => {
    let deadThisRound = 0;
    const smallArmyWarrior = smallArmy[indexSmall];
    const bigArmyWarrior = bigArmy[indexBig];

    const attackOrder = Math.random();

    if (attackOrder > 0.5) {
      const smallAttacker = this.smallArmyAttacker(
        smallArmyWarrior,
        bigArmyWarrior,
        disaster,
        bigArmy,
        indexBig,
        battleLog,
        peopleKilled,
      );
      deadThisRound += smallAttacker;
    } else {
      const bigAttacker = this.bigArmyAttacker(
        smallArmyWarrior,
        bigArmyWarrior,
        disaster,
        smallArmy,
        indexSmall,
        battleLog,
        peopleKilled,
      );
      deadThisRound += bigAttacker;
    }
    return deadThisRound;
  };

  // main function with the general overview of the battle + logging
  async calculateBattle(army1num: number, army2num: number): Promise<string[]> {
    const firstArmy = await this.armyCalculator(army1num);
    const secondArmy = await this.armyCalculator(army2num);

    const smallArmy =
      firstArmy.length > secondArmy.length ? secondArmy : firstArmy;
    const bigArmy =
      firstArmy.length > secondArmy.length ? firstArmy : secondArmy;

    const battleLog: string[] = [];
    let totalDead = 0;
    let deadThisRound = 0;
    let round = 1;
    battleLog.push(
      `The battle has begun! Bigger army has ${bigArmy.length} warriors. Smaller army has ${smallArmy.length} warriors`,
    );
    while (smallArmy.length !== 0 && bigArmy.length !== 0) {
      for (let indexBig = 0; indexBig < bigArmy.length; indexBig++) {
        for (let indexSmall = 0; indexSmall < smallArmy.length; indexSmall++) {
          const disasterModulo =
            Math.floor(
              Math.random() * (DISASTER_RANGE[0] - DISASTER_RANGE[1] + 1),
            ) + DISASTER_RANGE[1];
          const upperDeathCap = this.calculateDeathCap(
            smallArmy.length,
            bigArmy.length,
          );
          const peopleKilled =
            Math.floor(Math.random() * (1 - upperDeathCap + 1)) + upperDeathCap;
          const disaster = this.generateDisaster(indexSmall, disasterModulo);

          const batleRound = this.battle(
            battleLog,
            bigArmy,
            smallArmy,
            disaster,
            indexBig,
            indexSmall,
            peopleKilled,
          );
          deadThisRound += batleRound;

          if (bigArmy.length === 0 || smallArmy.length === 0) {
            battleLog.push(
              `The battle has ended after ${round} rounds of fighting ${
                bigArmy.length === 0
                  ? `The smaller army won with ${smallArmy.length} warriors left.`
                  : `The bigger army won with ${bigArmy.length} warriors left.`
              } Total dead: ${totalDead}`,
            );
            break;
          }
          if (indexSmall === smallArmy.length - 1) {
            battleLog.push(
              `Battle status at the end of round ${round}: Bigger army has ${bigArmy.length} warriors left. Smaller army has ${smallArmy.length} warriors left. Warriors that died this round ${deadThisRound}`,
            );
            totalDead += deadThisRound;
            deadThisRound = 0;
            round += 1;
          }
        }
      }
    }
    // an array with the logs of battle
    return battleLog;
  }
}
