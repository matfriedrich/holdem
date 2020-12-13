class PokerTable {
    constructor() {
      console.log("PokerTable")
      this.pot = 0
      this.game_running = 0
      this.players = []
    }
    addPlayer(player) {
        if(this.players.length < 4) {
            this.players.push(player);
            return this.players.length;
        }
        else {
            return 0;
        }
        
        
    }
  }
  
  module.exports = PokerTable;