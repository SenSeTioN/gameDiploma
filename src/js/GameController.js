import themes from './themes';
import GameState from './GameState';
import cursors from './cursors';
import getTransitionAttackCells from './transitionAttackCells';
import createPositionsChar, {
  chooseRandPositions,
  restoreChar,
} from './createPositions';
import {
  calculateDamage,
  getInfo,
  getRandomCharacter,
  overwriteProperties,
  restoreCharacters,
} from './utils';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState(this.gamePlay);

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.newGame = this.newGame.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.loadGame = this.loadGame.bind(this);

    this.events();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.initNewTeams();
    this.updatePicture();
  }

  events() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
  }

  newGame() {
    const data = {
      levelGame: 1,
      countClick: 0,
      history: [
        ...this.gameState.history,
        {
          levelGame: this.gameState.levelGame,
          points: this.gameState.points,
        },
      ],
      isMove: 'user',
      block: false,
      points: 0,
    };

    overwriteProperties(this.gameState, data);

    this.reset();
    this.init();
  }

  saveGame() {
    this.gameState.attackCells = [];
    this.gameState.transitionCells = [];
    this.gameState.activeCharUser = null;
    this.stateService.save(this.gameState);
    this.gamePlay.showModalMessage('Your game has saved!', '9997');
  }

  loadGame() {
    try {
      const savedGameState = this.stateService.load();
      this.restoreGameState(savedGameState);
      this.restoreActiveCharacter(savedGameState.activeChar);
      this.updatePicture();
      this.showGameInfo();
    } catch (e) {
      this.handleLoadingError();
    }
  }

  restoreGameState(savedState) {
    const {
      levelGame,
      countClick,
      history,
      isMove,
      block,
      points,
      indexSelect,
    } = savedState;

    overwriteProperties(this.gameState, {
      levelGame: block ? levelGame - 1 : levelGame,
      countClick,
      history,
      isMove,
      block,
      points,
      indexSelect,
    });

    this.resetTeams(savedState);
  }

  restoreActiveCharacter(savedActiveChar) {
    const restartedActiveChar = restoreChar(savedActiveChar);
    if (restartedActiveChar && restartedActiveChar.isMove === 'user') {
      this.reactOnClick(restartedActiveChar, [
        'bowman',
        'swordsman',
        'magician',
      ]);
    }
  }

  handleLoadingError() {
    this.gamePlay.showModalMessage("There's no game in memory", '128075');
    this.newGame();
  }

  initNewTeams() {
    this.gameState.userTeam = this.getUserTeam([
      this.gameState.levelGame,
      this.gameState.levelGame,
    ]);
    this.gameState.compTeam = this.getCompTeam([
      this.gameState.levelGame,
      this.gameState.levelGame,
    ]);
  }

  getUserTeam([maxLevel, charCount]) {
    const userTypes = [Bowman, Swordsman, Magician];
    const userTeam = createPositionsChar(
      userTypes,
      this.gamePlay.boardSize,
      false,
      [maxLevel, charCount],
    );
    this.gameState.userTeam = userTeam;
    return userTeam;
  }

  getCompTeam([maxLevel, charCount]) {
    const compTypes = [Vampire, Daemon, Undead];
    const compTeam = createPositionsChar(
      compTypes,
      this.gamePlay.boardSize,
      true,
      [maxLevel, charCount],
    );
    this.gameState.compTeam = compTeam;
    return compTeam;
  }

  resetTeams(gameState) {
    this.gameState.userTeam = restoreCharacters(
      gameState.userTeam,
      restoreChar,
    );
    this.gameState.compTeam = restoreCharacters(
      gameState.compTeam,
      restoreChar,
    );
  }

  levelUp() {
    const themeValues = Object.values(themes);

    this.updateTeams();
    this.gameState
      .getAllPlayer()
      .forEach((player) => player.character.levelUp());
    this.gamePlay.drawUi(
      themeValues[(this.gameState.levelGame - 1) % themeValues.length],
    );
    this.gameState.countClick = 0;
    this.gameState.indexSelect = null;
  }

  updateTeams() {
    const newUserTeam = this.getUserTeam([
      this.gameState.levelGame - 1,
      this.gameState.levelGame,
    ]);
    const allStartPositions = chooseRandPositions(this.gamePlay.boardSize);
    newUserTeam.forEach((item) => {
      allStartPositions.splice(allStartPositions.indexOf(item.position), 1);
    });

    this.gameState.userTeamSurvivors.forEach((survivor) => {
      if (!allStartPositions.includes(survivor.position)) {
        const newPosition = allStartPositions[
          Math.floor(Math.random() * allStartPositions.length)
        ];
        // eslint-disable-next-line no-param-reassign
        survivor.position = newPosition;
      }
    });

    this.gameState.userTeam = this.gameState.userTeamSurvivors.concat(newUserTeam);
    this.gameState.userTeamSurvivors = [];
    this.gameState.compTeam = this.getCompTeam([
      this.gameState.levelGame - 1,
      this.gameState.userTeam.length,
    ]);
  }

  showGameInfo() {
    const message = this.gameState.points
      ? `Your level ${this.gameState.levelGame} and points ${this.gameState.points}`
      : "There's no points. \n It's the first round";
    const iconCode = this.gameState.points ? '128076' : '128083';

    this.gamePlay.showModalMessage(message, iconCode);
  }

  async onCellClick(index) {
    if (this.gameState.block) return;

    const player = this.gameState
      .getAllPlayer()
      .find((el) => el.position === index);

    if (this.gameState.activeChar) {
      await this.handleUserTurn(index);
    }

    this.reactOnClick(player, ['bowman', 'swordsman', 'magician']);

    if (this.gameState.countClick >= 1) {
      await this.handleComputerTurn();
    }
  }

  async handleUserTurn(index) {
    if (!this.gameState.indexSelect) return;

    if (this.gameState.indexSelect.green === index) {
      this.gameState.activeChar.position = index;
      this.gameState.countClick += 1;
      this.gamePlay.redrawPositions(this.gameState.getAllPlayer());
    }

    if (this.gameState.indexSelect.red === index) {
      this.gameState.isMove = 'user';
      const responseDoDamage = await this.doDamage(index);
      if (responseDoDamage) {
        this.gameState.countClick += 1;
        this.gamePlay.redrawPositions(this.gameState.getAllPlayer());
        await this.checkGameProgress();
      }
    }
  }

  async checkGameProgress() {
    if (this.gameState.compTeam.length === 0) {
      this.gameState.levelGame += 1;
      this.gameState.points += this.gameState.calculateSumPoints();
      this.reset();

      // Uncomment the following if you want to handle game ending
      // await this.checkGameOver();

      this.gameState.userTeamSurvivors = this.gameState.userTeam;
      this.gamePlay.showModalMessage(
        `Level up! Your level ${this.gameState.levelGame} and total points are ${this.gameState.points}`,
        '9996',
      );
      this.levelUp();
      this.gamePlay.redrawPositions(this.gameState.getAllPlayer());
    }
  }

  // Uncomment the following if you want to handle game ending
  // async checkGameOver() {
  //   if (this.gameState.levelGame >= 5) {
  //     this.gameState.point = this.gameState.calculateSumPoints();
  //     this.gameState.block = true;
  //     this.gamePlay.redrawPositions(this.gameState.allPlayer);
  // eslint-disable-next-line max-len
  //     this.gamePlay.showModalMessage(`You win! Your points are ${this.gameState.point}`, '127881');
  //     return;
  //   }
  // }

  async handleComputerTurn() {
    this.gameState.activeCharUser = this.gameState.activeChar;
    this.gameState.isMove = 'comp';
    const responseDoAttackComp = await this.doAttackComp(this);
    if (responseDoAttackComp) {
      this.gameState.countClick = 0;
      this.gameState.isMove = 'user';

      if (this.gameState.findPresumedDeceasedPlayer()) {
        this.gameState.activeChar = this.gameState.activeCharUser;
        this.reactOnClick(this.gameState.activeChar, [
          'bowman',
          'swordsman',
          'magician',
        ]);
        this.gamePlay.redrawPositions(this.gameState.getAllPlayer());
      }
    }
  }

  onCellEnter(index) {
    if (this.gameState.block) return;

    const player = this.gameState.getPlayer(index);
    if (player) {
      this.gamePlay.showCellTooltip(getInfo(player.character), index);
    }

    if (!this.gameState.activeChar) return;

    const isTransitionCell = this.gameState.transitionCells.includes(index);
    const isAttackCell = this.gameState.attackCells.includes(index);
    const isUserCell = this.gameState.userTeam.some(
      (item) => item.position === index,
    );
    const isCompCell = this.gameState.compTeam.some(
      (item) => item.position === index,
    );

    this.gamePlay.setCursor(cursors.pointer);

    if (this.gameState.indexSelect) {
      if (isTransitionCell && !isUserCell && !isCompCell) {
        this.gameState.indexSelect.green = index;
        this.gamePlay.selectCell(index, 'green');
      }

      if (isAttackCell && isCompCell) {
        this.gameState.indexSelect.red = index;
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);

    if (this.gameState.block) return;

    const hasSelectedGreen = document.querySelector('.selected-green');
    const isAttackCell = this.gameState.attackCells?.includes(index);
    const isCompTeamPosition = this.gameState.compTeam.some(
      (item) => item.position === index,
    );

    if (hasSelectedGreen) {
      this.gamePlay.deselectCell(this.gameState.indexSelect.green);

      if (!isAttackCell && isCompTeamPosition) {
        this.gamePlay.deselectCell(this.gameState.indexSelect.green);
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }

    if (document.querySelector('.selected-red')) {
      this.gamePlay.deselectCell(this.gameState.indexSelect.red);
    }
  }

  reactOnClick(player, arrayTypes) {
    if (!player) return;

    if (arrayTypes.includes(player.character.type)) {
      this.updateSelectedCell(player.position);
      this.gamePlay.selectCell(player.position);

      this.gameState.activeChar = player;
      const { maxRange, maxAttack } = player.character;

      this.gameState.transitionCells = getTransitionAttackCells(
        player.position,
        this.gamePlay.boardSize,
        maxRange,
      );
      this.gameState.attackCells = getTransitionAttackCells(
        player.position,
        this.gamePlay.boardSize,
        maxAttack,
        true,
      );
    } else {
      this.handleInvalidSelection(player.position);
    }
  }

  updateSelectedCell(num) {
    if (
      this.gameState.indexSelect
      && document.querySelector('.selected-yellow')
    ) {
      this.gamePlay.deselectCell(this.gameState.indexSelect.yellow);
    }
    this.gameState.indexSelect = { yellow: num };
  }

  handleInvalidSelection(num) {
    const isSelected = this.gameState.indexSelect;
    const isNotInAttackCells = !this.gameState.attackCells.includes(num);
    const isComputerTeamPosition = this.gameState.compTeam.some(
      (item) => item.position === num,
    );

    if (isSelected && isNotInAttackCells && isComputerTeamPosition) {
      this.gamePlay.showModalMessage("It can't be done", '9940');
    } else if (!this.gameState.activeChar) {
      this.gamePlay.showModalMessage('This isn`t your character', '9995');
    }
  }

  async doDamage(index) {
    const { attack } = this.gameState.activeChar.character;
    const opponent = this.gameState.getPlayer(index);
    const { defence, health } = opponent.character;

    const damage = calculateDamage(attack, defence);
    const responseShowDamage = await this.gamePlay.showDamage(index, damage);

    if (responseShowDamage) {
      opponent.character.health = health - damage;
      this.checkHealthRemoveDead(opponent);
      return true;
    }

    return false;
  }

  checkHealthRemoveDead(player) {
    if (player.character.health <= 0) {
      const info = this.gameState.getPresumedDeceasedPlayerInfo(
        player.position,
      );

      if (info.index !== -1) {
        this.gameState[info.teamKey].splice(info.index, 1);
        this.gameState.indexSelect = null;
      }
    }
  }

  reset() {
    if (!this.gameState.indexSelect) return;

    Object.keys(this.gameState.indexSelect).forEach((color) => {
      this.gamePlay.deselectCell(this.gameState.indexSelect[color]);
    });
    this.gameState.indexSelect = null;
    this.gamePlay.setCursor(cursors.auto);
  }

  updatePicture() {
    const level = this.gameState.levelGame > 0 ? this.gameState.levelGame - 1 : 0;
    this.gamePlay.drawUi(Object.values(themes)[level]);
    this.gamePlay.redrawPositions(this.gameState.getAllPlayer());

    if (this.gameState.indexSelect && this.gameState.indexSelect.yellow) {
      this.gamePlay.selectCell(this.gameState.indexSelect.yellow);
    }
  }

  async doAttackComp() {
    const activeComp = getRandomCharacter(this.gameState.compTeam);
    this.gameState.activeChar = activeComp;
    this.reactOnClick(activeComp, ['daemon', 'undead', 'vampire']);

    const userPosition = this.gameState.getUserPosition();

    if (userPosition !== undefined) {
      const responseDoDamage = await this.doDamage(userPosition);
      if (responseDoDamage) {
        this.checkAndEndGameIfNecessary();
        this.updatePicture();
      }
    } else {
      this.gameState.activeChar.position = this.moveToRandomPosition();
      this.gamePlay.redrawPositions(this.gameState.getAllPlayer());
    }

    this.gameState.activeChar = null;
    this.reset();

    return true;
  }

  checkAndEndGameIfNecessary() {
    if (this.gameState.userTeam.length === 0) {
      this.gameState.block = true;

      this.gamePlay.showModalMessage('You lose!', '129335');
    }
  }

  moveToRandomPosition() {
    let rand;
    let isPlayer;
    do {
      rand = Math.floor(Math.random() * this.gameState.transitionCells.length);
      const potentialPosition = this.gameState.transitionCells[rand];
      isPlayer = this.gameState
        .getAllPlayer()
        .some((o) => o.position === potentialPosition);
    } while (isPlayer);

    return this.gameState.transitionCells[rand];
  }
}
