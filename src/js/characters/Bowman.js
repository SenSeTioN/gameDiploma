import Character from './Character';

export default class Bowman extends Character {
  constructor(level = 1) {
    super(level);
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
    this.maxRange = 2;
    this.maxAttack = 2;
  }
}
