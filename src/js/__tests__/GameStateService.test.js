import GameStateService from '../GameStateService';

let mockStorage;
let stateService;

beforeEach(() => {
  mockStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };
  stateService = new GameStateService(mockStorage);
  jest.clearAllMocks();
});

test('Check state saving', () => {
  const state = { point: 10, maxPoint: 10, level: 1 };
  stateService.save(state);
  expect(mockStorage.setItem).toHaveBeenCalledWith('state', JSON.stringify(state));
});

test('Check valid state loading', () => {
  const state = { point: 10, maxPoint: 10, level: 1 };
  mockStorage.getItem.mockReturnValue(JSON.stringify(state));
  expect(stateService.load()).toEqual(state);
});

test('Check loading with invalid JSON', () => {
  mockStorage.getItem.mockReturnValue('invalid JSON string');
  expect(() => stateService.load()).toThrow('Invalid state');
});

test('Check loading when state is null', () => {
  mockStorage.getItem.mockReturnValue(null);
  expect(stateService.load()).toBeNull();
});
