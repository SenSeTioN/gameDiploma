import {
  calcTileType,
  calcHealthLevel,
  upAttackDefence,
  getInfo,
  calculateDamage,
  restoreCharacters,
  getRandomCharacter,
  overwriteProperties,
} from '../utils';

test.each([
  [1, 8, 'top', 'top edge'],
  [6, 8, 'top', 'top edge'],
  [1, 7, 'top', 'top edge'],
  [5, 7, 'top', 'top edge'],
  [57, 8, 'bottom', 'bottom edge'],
  [62, 8, 'bottom', 'bottom edge'],
  [43, 7, 'bottom', 'bottom edge'],
  [47, 7, 'bottom', 'bottom edge'],
  [8, 8, 'left', 'left edge'],
  [48, 8, 'left', 'left edge'],
  [7, 7, 'left', 'left edge'],
  [35, 7, 'left', 'left edge'],
  [15, 8, 'right', 'right edge'],
  [55, 8, 'right', 'right edge'],
  [13, 7, 'right', 'right edge'],
  [41, 7, 'right', 'right edge'],
  [0, 8, 'top-left', 'top-left edge'],
  [7, 8, 'top-right', 'top-right edge'],
  [0, 7, 'top-left', 'top-left edge'],
  [6, 7, 'top-right', 'top-right edge'],
  [56, 8, 'bottom-left', 'bottom-left edge'],
  [63, 8, 'bottom-right', 'bottom-left edge'],
  [42, 7, 'bottom-left', 'bottom-right edge'],
  [48, 7, 'bottom-right', 'bottom-right edge'],
  [35, 8, 'center', 'center edge'],
  [25, 7, 'center', 'center edge'],
])(
  'should return %s for index %i with board size %i',
  (index, boardSize, expected) => {
    const result = calcTileType(index, boardSize);

    expect(result).toBe(expected);
  },
);

test.each([
  [0, 'critical', 'when health is 0'],
  [10, 'critical', 'when health is 10'],
  [14, 'critical', 'when health is 14'],
  [15, 'normal', 'when health is 15'],
  [35, 'normal', 'when health is 35'],
  [49, 'normal', 'when health is 49'],
  [50, 'high', 'when health is 50'],
  [51, 'high', 'when health is 51'],
  [100, 'high', 'when health is 100'],
])('should return %s %s', (health, expected) => {
  const result = calcHealthLevel(health);

  expect(result).toBe(expected);
});

describe('upAttackDefence', () => {
  it('should calculate the attack/defence correctly', () => {
    expect(upAttackDefence(100, 50)).toBe(130);
    expect(upAttackDefence(0, 50)).toBe(0);
  });
});

describe('getInfo', () => {
  it('should return the correct info string', () => {
    const player = {
      level: 5,
      attack: 100,
      defence: 50,
      health: 80,
    };
    const expectedString = '\u{1F396}5 \u2694100 \u{1F6E1}50 \u276480';
    expect(getInfo(player)).toBe(expectedString);
  });

  describe('restoreCharacters', () => {
    it('should correctly restore characters', () => {
      const characters = [{ health: 50 }, { health: 40 }];
      const restoreFn = (char) => ({ ...char, health: 100 });

      const result = restoreCharacters(characters, restoreFn);

      expect(result).toEqual([{ health: 100 }, { health: 100 }]);
    });
  });

  describe('calculateDamage', () => {
    it('should correctly calculate damage when attack is more than defence', () => {
      const attack = 100;
      const defence = 50;
      const result = calculateDamage(attack, defence);

      expect(result).toBe(50); // 100 - 50
    });

    it('should return 30% of attack when defence is more than attack', () => {
      const attack = 50;
      const defence = 100;
      const result = calculateDamage(attack, defence);

      expect(result).toBe(15); // 30% of 50
    });
  });

  describe('overwriteProperties', () => {
    it('should correctly overwrite properties of the target object', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source = { b: 4, c: 5 };

      const result = overwriteProperties(target, source);

      expect(result).toEqual({ a: 1, b: 4, c: 5 });
    });

    it('should return the same reference to the target object', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      const result = overwriteProperties(target, source);

      expect(result).toBe(target);
    });
  });

  describe('getRandomCharacter', () => {
    it('should return a character from the team', () => {
      const team = ['char1', 'char2', 'char3'];

      const result = getRandomCharacter(team);

      expect(team).toContain(result);
    });

    it('should potentially return any character from the team', () => {
      const team = ['char1', 'char2', 'char3'];
      const results = new Set();

      for (let i = 0; i < 100; i += 1) {
        results.add(getRandomCharacter(team));
      }

      expect(results.has('char1')).toBeTruthy();
      expect(results.has('char2')).toBeTruthy();
      expect(results.has('char3')).toBeTruthy();
    });
  });
});
