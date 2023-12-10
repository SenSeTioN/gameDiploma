import GameController from '../GameController';

describe('GameController', () => {
  let gameController;

  beforeEach(() => {
    const gamePlayMock = {
      addCellEnterListener: jest.fn(),
      addCellLeaveListener: jest.fn(),
      addCellClickListener: jest.fn(),
      addNewGameListener: jest.fn(),
      addSaveGameListener: jest.fn(),
      addLoadGameListener: jest.fn(),
    };
    const stateServiceMock = {}; // Мок stateService
    gameController = new GameController(gamePlayMock, stateServiceMock);
  });

  test('should call initNewTeams and updatePicture on init', () => {
    gameController.initNewTeams = jest.fn();
    gameController.updatePicture = jest.fn();

    gameController.init();

    expect(gameController.initNewTeams).toHaveBeenCalled();
    expect(gameController.updatePicture).toHaveBeenCalled();
  });

  test('should update gameState on newGame', () => {
    gameController.reset = jest.fn();
    gameController.init = jest.fn();

    gameController.newGame();

    expect(gameController.gameState.levelGame).toBe(1);
    expect(gameController.gameState.countClick).toBe(0);
    expect(gameController.reset).toHaveBeenCalled();
    expect(gameController.init).toHaveBeenCalled();
  });

  test('should restore gameState on loadGame', () => {
    const savedStateMock = {
      levelGame: 2,
      countClick: 1,
    };

    gameController.stateService.load = jest.fn(() => savedStateMock);
    gameController.restoreGameState = jest.fn();
    gameController.restoreActiveCharacter = jest.fn();
    gameController.updatePicture = jest.fn();
    gameController.showGameInfo = jest.fn();

    gameController.loadGame();

    expect(gameController.restoreGameState).toHaveBeenCalledWith(savedStateMock);
    expect(gameController.restoreActiveCharacter).toHaveBeenCalledWith(savedStateMock.activeChar);
    expect(gameController.updatePicture).toHaveBeenCalled();
    expect(gameController.showGameInfo).toHaveBeenCalled();
  });
});
