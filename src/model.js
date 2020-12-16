class Model {
  constructor() {
    this.pokertable = new PokerTable()
    this.isActive = false
    this.playerTurn = false
    this.playerId
  }
  addPlayer(player) {
    this.pokertable.addPlayer(player)
  }
  updateModel() {
    // todo
  }
  storeResult() {
    // todo
  }

  setIsActive(bool) {
    this.isActive = bool;
  }

  getIsActive(bool) {
    return this.isActive;
  }

  setPlayerTurn(bool) {
    this.playerTurn = bool;
  }

  getPlayerTurn() {
    return this.playerTurn;
  }

  setPlayerId(id) {
    this.playerId = id;
  }

  getPlayerId() {
    return this.playerId;
  }
}
