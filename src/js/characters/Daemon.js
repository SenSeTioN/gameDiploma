import Character from './Character';

export default class Daemon extends Character {
  constructor(level = 1) {
    super(level);
    this.type = 'daemon';
    this.attack = 10;
    this.defence = 10;
    this.maxRange = 1;
    this.maxAttack = 4;
  }
}
