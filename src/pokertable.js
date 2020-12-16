class PokerTable {
  constructor() {
    console.log("PokerTable")
    this.pot = 0
    this.game_running = 0
    this.player
    this.players = []
    this.flop = []
    this.river
    this.turn
  }
  addPlayer(player) {
    this.players.push(player)
  }
}
