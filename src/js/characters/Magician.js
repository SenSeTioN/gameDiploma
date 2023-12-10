import Character from './Character';

export default class Magician extends Character {
  constructor(level = 1) {
    super(level);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    this.maxRange = 1;
    this.maxAttack = 4;
  }
}
