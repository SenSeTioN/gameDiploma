import Character from './Character';

export default class Undead extends Character {
  constructor(level = 1) {
    super(level);
    this.type = 'undead';
    this.attack = 40;
    this.defence = 10;
    this.maxRange = 4;
    this.maxAttack = 1;
  }
}
