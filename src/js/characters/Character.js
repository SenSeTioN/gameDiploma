import { upAttackDefence } from '../utils';

/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Invalid class');
    }
    this.type = type;
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
  }

  levelUp() {
    if (this.health <= 0) {
      throw new Error("Can't level up a dead character");
    }

    this.level = Math.min(this.level + 1, 4);
    this.attack = upAttackDefence(this.attack, this.health);
    this.defence = upAttackDefence(this.defence, this.health);
    this.health = Math.min(this.health + 80, 100);
  }
}
