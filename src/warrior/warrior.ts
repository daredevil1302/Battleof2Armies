export class Warrior {
  health: number;
  power: number;
  armor: number;
  type: string;
  constructor(health: number, power: number, armor: number, type: string) {
    this.health = health;
    this.power = power;
    this.armor = armor;
    this.type = type;
  }
  attack(enemy: Warrior) {
    return enemy.decreaseHealth(this.power, enemy);
  }
  decreaseHealth(power: number, enemy: Warrior) {
    const armorMultiplicator = 1 - enemy.armor / 200;
    const newHealth = this.health - power * armorMultiplicator;
    enemy.health = newHealth;
    return newHealth <= 0;
  }
}
