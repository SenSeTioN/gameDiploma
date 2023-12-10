/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  if (index < boardSize - 1 && index > 0) {
    return 'top';
  }
  if (index < boardSize ** 2 - 1 && index > boardSize ** 2 - boardSize) {
    return 'bottom';
  }
  for (let i = 1; i < boardSize - 1; i += 1) {
    if (index === boardSize * i) {
      return 'left';
    }
    if (index === boardSize * i + (boardSize - 1)) {
      return 'right';
    }
  }

  switch (index) {
    case 0:
      return 'top-left';
    case boardSize - 1:
      return 'top-right';
    case boardSize * (boardSize - 1):
      return 'bottom-left';
    case boardSize ** 2 - 1:
      return 'bottom-right';
    default:
      return 'center';
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function restoreCharacters(characters, restoreFn) {
  return characters.map(restoreFn);
}

export function upAttackDefence(before, life) {
  return Math.floor(Math.max(before, (before * (80 + life)) / 100));
}

export function calculateDamage(attack, defence) {
  return Math.round(Math.max(attack - defence, attack * 0.3));
}

export function getInfo(player) {
  return `\u{1F396}${player.level} \u2694${player.attack} \u{1F6E1}${player.defence} \u2764${player.health}`;
}

export function overwriteProperties(target, source) {
  Object.assign(target, source);
  return target;
}

export function getRandomCharacter(team) {
  const randomIndex = Math.floor(Math.random() * team.length);
  return team[randomIndex];
}
