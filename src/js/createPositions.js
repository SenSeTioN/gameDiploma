import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export function chooseRandPositions(boardSize, opponent = false) {
  const cells = [];
  if (!opponent) {
    for (let i = 0; i < boardSize ** 2; i += 8) {
      cells.push(i);
      cells.push(i + 1);
    }
  } else {
    for (let i = boardSize - 2; i < boardSize ** 2; i += boardSize) {
      cells.push(i);
      cells.push(i + 1);
    }
  }
  return cells;
}

function chooseRandPosition(boardSize, opponent = false) {
  const cells = chooseRandPositions(boardSize, opponent);
  const rand = Math.floor(Math.random() * cells.length);
  return cells[rand];
}

/* eslint-disable */
export default function createPositionsChar(
  playerTypes,
  boardSize,
  opponent,
  [maxLevel, charCount]
) {
  const positions = [];
  if (maxLevel >= 4) maxLevel = 4;
  if (charCount >= 10) charCount = 10;
  const team = generateTeam(playerTypes, maxLevel, charCount);

  const randPositions = [];
  team.characters.forEach((char) => {
    let randPosition;
    let isPositionUnique = false;
    do {
      randPosition = chooseRandPosition(boardSize, opponent);
      if (randPositions.find((el) => el === randPosition)) {
        randPosition = chooseRandPosition(boardSize, opponent);
      } else {
        randPositions.push(randPosition);
        isPositionUnique = true;
      }
    } while (!isPositionUnique);
    positions.push(new PositionedCharacter(char, randPosition));
  });
  return positions;
}

export function restoreChar(obj) {
  if (!obj) return null;
 
  const charClasses = {
    bowman: Bowman,
    swordsman: Swordsman,
    magician: Magician,
    daemon: Daemon,
    undead: Undead,
    vampire: Vampire,
  };

  const CharClass = charClasses[obj._character.type] || null;
  const char = new CharClass(obj._character.level);
  const restorePositionedChar = new PositionedCharacter(char, obj._position);

  char.attack = obj._character.attack;
  char.health = obj._character.health;
  char.defence = obj._character.defence;

  return restorePositionedChar;
}
