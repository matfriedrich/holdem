class PokerTable {
  constructor() {
    console.log("PokerTable")
    this.pot = 0
    this.game_running = 0
    this.players = []
  }
  addPlayer(player) {
    this.players.push(player)
  }
}
