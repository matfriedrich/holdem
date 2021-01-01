class PokerTable {
  constructor() {
    console.log("PokerTable")
    this.pot = 0
    this.game_running = 0
    this.playerId
    this.players = []
    this.isActivePlayer
    this.flop = []
    this.river
    this.turn
    this.options
    this.lastAction
    this.result
  }

  setPlayers(players) {
    this.players = players;
  }

  updatePokertable(msg) {
    
    this.pot = msg.pot;
    this.isActivePlayer = false;

    if(this.playerId == msg.activePlayer){
      this.isActivePlayer = true;
    }

    msg.playerToRemove.forEach(element => {
      this.players.splice(element, 1)
    });

    this.players = msg.players;

    this.flop = msg.flop;
    this.turn = msg.turn;
    this.river = msg.river;

    this.options = msg.options;
    this.lastAction = msg.lastaction;
    this.result = msg.result;
  }

  setPlayerId(id) {
    this.playerId = id;
  }

  getPlayerId() {
    return this.playerId;
  }
}
