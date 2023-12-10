import Vampire from '../characters/Vampire';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Character from '../characters/Character';

test.each([
  [
    Bowman,
    1,
    {
      type: 'bowman',
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      maxAttack: 2,
      maxRange: 2,
    },
  ],
  [
    Bowman,
    undefined,
    {
      type: 'bowman',
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      maxAttack: 2,
      maxRange: 2,
    },
  ],
  [
    Swordsman,
    1,
    {
      type: 'swordsman',
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      maxAttack: 1,
      maxRange: 4,
    },
  ],
  [
    Swordsman,
    undefined,
    {
      type: 'swordsman',
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      maxAttack: 1,
      maxRange: 4,
    },
  ],
  [
    Magician,
    1,
    {
      type: 'magician',
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      maxAttack: 4,
      maxRange: 1,
    },
  ],
  [
    Magician,
    undefined,
    {
      type: 'magician',
      level: 1,
      attack: 10,
      defence: 40,
      health: 50,
      maxAttack: 4,
      maxRange: 1,
    },
  ],
  [
    Vampire,
    1,
    {
      type: 'vampire',
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      maxAttack: 2,
      maxRange: 2,
    },
  ],
  [
    Vampire,
    undefined,
    {
      type: 'vampire',
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      maxAttack: 2,
      maxRange: 2,
    },
  ],
  [
    Daemon,
    1,
    {
      type: 'daemon',
      level: 1,
      attack: 10,
      defence: 10,
      health: 50,
      maxAttack: 4,
      maxRange: 1,
    },
  ],
  [
    Daemon,
    undefined,
    {
      type: 'daemon',
      level: 1,
      attack: 10,
      defence: 10,
      health: 50,
      maxAttack: 4,
      maxRange: 1,
    },
  ],
  [
    Undead,
    1,
    {
      type: 'undead',
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      maxAttack: 1,
      maxRange: 4,
    },
  ],
  [
    Undead,
    undefined,
    {
      type: 'undead',
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      maxAttack: 1,
      maxRange: 4,
    },
  ],
])('should create new class', (Type, level, expected) => {
  const result = new Type(level);
  expect(result).toEqual(expected);
});

test('should be Error for create new Character', () => {
  expect(() => new Character(2)).toThrow('Invalid class');
});

test('should level up a character', () => {
  const char = new Bowman(1);
  char.levelUp();
  expect(char.level).toBe(2);
  expect(char.health).toBe(100);
});

test('should throw error when trying to level up a dead character', () => {
  const char = new Bowman(1);
  char.health = 0;
  expect(() => char.levelUp()).toThrow("Can't level up a dead character");
});

test('character level should not exceed 4', () => {
  const char = new Bowman(4);
  char.levelUp();
  expect(char.level).toBe(4);
});
