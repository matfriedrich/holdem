class Model {
  constructor() {
    console.log("Model")
    this.pokertable = new PokerTable()
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
}
