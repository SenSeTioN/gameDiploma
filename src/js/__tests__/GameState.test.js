import GamePlay from '../GamePlay';
import GameState from '../GameState';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    const gamePlay = new GamePlay();
    gameState = new GameState(gamePlay);
  });

  test('getAllPlayer should return all players', () => {
    gameState.userTeam = [{ position: 1 }, { position: 2 }];
    gameState.compTeam = [{ position: 3 }];
    const result = gameState.getAllPlayer();
    expect(result).toHaveLength(3);
    expect(result).toEqual([{ position: 1 }, { position: 2 }, { position: 3 }]);
  });

  test('calculateSumPoints should return the sum of health for userTeam', () => {
    gameState.userTeam = [{ character: { health: 10 } }, { character: { health: 20 } }];
    expect(gameState.calculateSumPoints()).toBe(30);
  });

  test('getAllPlayer should throw error if userTeam or compTeam is missing', () => {
    gameState.userTeam = null;
    expect(() => gameState.getAllPlayer()).toThrow('it must have 2 arguments');
  });

  test('getUserPosition should return user position when attackCells includes player position', () => {
    gameState.userTeam = [{ position: 1 }];
    gameState.attackCells = [1, 2];
    expect(gameState.getUserPosition()).toBe(1);
  });

  test('getUserPosition should return undefined when attackCells does not include player position', () => {
    gameState.userTeam = [{ position: 3 }];
    gameState.attackCells = [1, 2];
    expect(gameState.getUserPosition()).toBeUndefined();
  });

  test('findPresumedDeceasedPlayer should find the player with matching activeCharUser position', () => {
    gameState.activeCharUser = { position: 2 };
    gameState.userTeam = [{ position: 1 }, { position: 2 }];
    gameState.compTeam = [{ position: 3 }];
    expect(gameState.findPresumedDeceasedPlayer()).toEqual({ position: 2 });
  });

  test('getPresumedDeceasedPlayerInfo should return the correct info when isMove is comp', () => {
    gameState.isMove = 'comp';
    gameState.userTeam = [{ position: 1 }, { position: 2 }];
    expect(gameState.getPresumedDeceasedPlayerInfo(2)).toEqual({
      index: 1,
      teamKey: 'userTeam',
    });
  });
});
