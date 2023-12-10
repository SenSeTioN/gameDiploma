import Character from './Character';

export default class Vampire extends Character {
  constructor(level = 1) {
    super(level);
    this.type = 'vampire';
    this.attack = 25;
    this.defence = 25;
    this.maxRange = 2;
    this.maxAttack = 2;
  }
}
