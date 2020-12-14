const Player = require('./player');

class PokerTable {
    constructor() {
      console.log("PokerTable")
      this.pot = 0
      this.game_running = 0
      this.players = []
    }
    addPlayer() {
        var status = 'fail';
        var newPlayer = new Player(0, 1000); 

        if(this.players.length < 4) {
            newPlayer.id = this.players.length + 1;
            this.players.push(newPlayer);
            status = 'success';
        }

        var message = {type: 'join', status: status, player: {id: newPlayer.id, 
            balance: newPlayer.balance}};

        return message;
    }
  }
  
  module.exports = PokerTable;