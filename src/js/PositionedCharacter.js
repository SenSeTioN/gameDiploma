import Character from './characters/Character';

export default class PositionedCharacter {
  constructor(character, position) {
    this.character = character;
    this.position = position;
  }

  set character(value) {
    if (!(value instanceof Character)) {
      throw new Error(
        'character must be instance of Character or its children',
      );
    }
    this._character = value;
  }

  get character() {
    return this._character;
  }

  set position(value) {
    if (typeof value !== 'number') {
      throw new Error('position must be a number');
    }
    this._position = value;
  }

  get position() {
    return this._position;
  }
}
