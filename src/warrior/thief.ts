import { Warrior } from './warrior';
const HEALTH_RANGE = [60, 90];
const POWER_RANGE = [80, 100];
const ARMOR_RANGE = [20, 30];

const health =
  Math.floor(Math.random() * (HEALTH_RANGE[0] - HEALTH_RANGE[1] + 1)) +
  HEALTH_RANGE[1];
const power =
  Math.floor(Math.random() * (POWER_RANGE[0] - POWER_RANGE[1] + 1)) +
  POWER_RANGE[1];
const armor =
  Math.floor(Math.random() * (ARMOR_RANGE[0] - ARMOR_RANGE[1] + 1)) +
  ARMOR_RANGE[1];
const type = 'Thief';
export class Thief extends Warrior {
  constructor() {
    super(health, power, armor, type);
  }
}
