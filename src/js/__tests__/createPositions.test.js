import createPositionsChar, { chooseRandPositions, restoreChar } from '../createPositions';
import Bowman from '../characters/Bowman';
import PositionedCharacter from '../PositionedCharacter';
import { generateTeam } from '../generators';

jest.mock('../generators');

describe('chooseRandPositions', () => {
  it('should return correct positions for player', () => {
    const result = chooseRandPositions(8);
    expect(result).toEqual([0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57]);
  });

  it('should return correct positions for opponent', () => {
    const result = chooseRandPositions(8, true);
    expect(result).toEqual([6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]);
  });
});

describe('createPositionsChar', () => {
  beforeEach(() => {
    generateTeam.mockReturnValue({
      characters: [new Bowman(1)],
    });
  });

  it('should generate team and return positioned characters', () => {
    const result = createPositionsChar([Bowman], 8, false, [1, 1]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(PositionedCharacter);
  });
});

describe('restoreChar', () => {
  it('should restore Bowman character', () => {
    const charObj = {
      _character: {
        type: 'bowman',
        level: 1,
        attack: 10,
        health: 100,
        defence: 40,
      },
      _position: 5,
    };

    const restoredCharacter = restoreChar(charObj);

    expect(restoredCharacter.character).toBeInstanceOf(Bowman);
    expect(restoredCharacter.character.attack).toBe(10);
    expect(restoredCharacter.character.health).toBe(100);
    expect(restoredCharacter.character.defence).toBe(40);
    expect(restoredCharacter.position).toBe(5);
  });

  it('should return null if no object is provided', () => {
    const result = restoreChar();
    expect(result).toBeNull();
  });
});
