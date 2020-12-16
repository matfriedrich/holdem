const Card = require('./card');

class Player {
    constructor(id, balance, ws) {
      this.id = id
      this.balance = balance
      this.card0
      this.card1
      this.connection = ws
    }

    setCard0(card) {
        card0 = card
    }

    getCard0(){
        return card0;
    }

    setCard1(card) {
        card1 = card
    }

    getCard1(){
        return card1;
    }
  }
  
  module.exports = Player;