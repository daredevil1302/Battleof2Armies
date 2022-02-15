export class Warrior {
  health: number;
  power: number;
  armor: number;
  constructor(health: number, power: number, armor: number) {
    this.health = health;
    this.power = power;
    this.armor = armor;
  }
  attack(enemy: Warrior) {
    return enemy.decreaseHealth(this.power);
  }
  decreaseHealth(power: number) {
    const newHealth = this.health - power;
    return newHealth <= 0;
  }
}
