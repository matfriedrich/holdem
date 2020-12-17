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
  }

  addPlayer(player) {
    this.players.push(player)
  }

  updatePokertable(msg) {
    
    this.pot = msg.pot;
    this.isActivePlayer = false;

    if(this.playerId == msg.activePlayer){
      this.isActivePlayer = true;
    }

    var i;
    for(i = 0; i < this.players.length; i++) {
      if(this.players[i].id == msg.players[i].id) {
        this.players[i] = msg.players[i];
        /*this.players[i].setBalance(msg.players[i].balance);
        this.players[i].setCard0(msg.players[i].card0);
        this.players[i].setCard1(msg.players[i].card1);
        this.players[i].setBet(msg.players[i].bet);*/
        continue;
      }

      console.log('Ids dont match up, something is wrong');
    }

    this.flop = msg.flop;
    this.turn = msg.turn;
    this.river = msg.river;

    this.options = msg.options;
  }

  setPlayerId(id) {
    this.playerId = id;
  }

  getPlayerId() {
    return this.playerId;
  }
}
