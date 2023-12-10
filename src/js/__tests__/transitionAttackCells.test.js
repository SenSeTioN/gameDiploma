import getTransitionAttackCells from '../transitionAttackCells';

test.each([
  [0, 8, 1, 3],
  [8, 7, 1, 8],
  [24, 5, 1, 3],
])('should be count transitCells ', (index, boardSize, maxRange, expected) => {
  const result = getTransitionAttackCells(index, boardSize, maxRange, false);
  expect(result.length).toBe(expected);
});

test.each([
  [0, 8, 1, 3],
  [8, 7, 1, 8],
  [24, 5, 2, 8],
])('should be count attackCells ', (index, boardSize, maxRange, expected) => {
  const result = getTransitionAttackCells(index, boardSize, maxRange, true);
  expect(result.length).toBe(expected);
});
