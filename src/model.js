class Model {
  constructor() {
    this.pokertable = new PokerTable()
  }

  bindPokertableChanged(callback) {
    this.onPokertableChanged = callback;
  }

  addPlayer(player) {
    this.pokertable.addPlayer(player)
  }

  updatePokertable(message) {
    this.pokertable.updatePokertable(message);

    this.onPokertableChanged(this.pokertable);
  }

  storeResult() {
    // todo
  }

  setPlayerId(id) {
    this.pokertable.setPlayerId(id);
  }

  getPlayerId() {
    return this.pokertable.getPlayerId();
  }
}
