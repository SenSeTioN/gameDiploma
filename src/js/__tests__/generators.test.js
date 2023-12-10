import { generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

// jest.useRealTimers();
// test.each([
//   [[Bowman, Swordsman, Magician], 1],
// ])(('should return new random Character'), (allowedTypes, maxLevel, expected) => {
//
//   const generator = characterGenerator(allowedTypes, maxLevel);
//   let result = generator.next().value;
//   // for (let i = 0; i < 5; i += 1) {
//   //   result = generator.next().value;
//   // }
//   expect(result.type).toBeDefined();
// });

test.each([
  [[Bowman, Swordsman, Magician], 1, 4, 4],
  [[Bowman, Swordsman, Magician], 1, 2, 2],
])(
  'should be four character in Team',
  (allowedTypes, maxLevel, characterCount, expected) => {
    const result = generateTeam(allowedTypes, maxLevel, characterCount);
    expect(result.characters.length).toBe(expected);
  },
);

test.each([[[Bowman, Swordsman, Magician], 4, 10, true]])(
  'should be character with the fourth level in Team',
  (allowedTypes, maxLevel, characterCount, expected) => {
    const { characters } = generateTeam(allowedTypes, maxLevel, characterCount);
    const char = characters.find((el) => el.level === 4);
    let result = false;
    if (char) {
      result = true;
    }
    expect(result).toBe(expected);
  },
);
