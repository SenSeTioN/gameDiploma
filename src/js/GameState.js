export default class GameState {
  constructor(gamePlay) {
    this.levelGame = 1;
    this.gamePlay = gamePlay;
    this.isMove = 'user';
    this.countClick = 0;
    this.userTeamSurvivors = [];
    this.history = [];
    this.points = 0;
    this.block = false;
    this.userTeam = [];
    this.compTeam = [];
    this.activeChar = null;
    this.indexSelect = null;
    this.transitionCells = [];
    this.attackCells = [];
    this.showModal = false;
  }

  getAllPlayer() {
    if (!this.userTeam || !this.compTeam) throw new Error('it must have 2 arguments');
    return [...this.userTeam, ...this.compTeam];
  }

  calculateSumPoints() {
    return this.userTeam.reduce((a, b) => a + b.character.health, 0);
  }

  getUserPosition() {
    const foundItem = this.userTeam.find((item) => this.attackCells.includes(item.position));
    return foundItem ? foundItem.position : undefined;
  }

  findPresumedDeceasedPlayer() {
    return this.getAllPlayer().find((e) => e.position === this.activeCharUser?.position);
  }

  getPresumedDeceasedPlayerInfo(position) {
    const team = this.isMove === 'comp' ? this.userTeam : this.compTeam;

    return {
      index: team.findIndex((item) => position === item.position),
      teamKey: this.isMove === 'comp' ? 'userTeam' : 'compTeam',
    };
  }

  getPlayer(index) {
    return this.getAllPlayer().find((el) => el.position === index);
  }
}
