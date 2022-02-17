import { Warrior } from './warrior';

const HEALTH_RANGE = [110, 130];
const POWER_RANGE = [20, 40];
const ARMOR_RANGE = [50, 70];

const health =
  Math.floor(Math.random() * (HEALTH_RANGE[0] - HEALTH_RANGE[1] + 1)) +
  HEALTH_RANGE[1];
const power =
  Math.floor(Math.random() * (POWER_RANGE[0] - POWER_RANGE[1] + 1)) +
  POWER_RANGE[1];
const armor =
  Math.floor(Math.random() * (ARMOR_RANGE[0] - ARMOR_RANGE[1] + 1)) +
  ARMOR_RANGE[1];
const type = 'Knight';
export class Knight extends Warrior {
  constructor() {
    super(health, power, armor, type);
  }
}
