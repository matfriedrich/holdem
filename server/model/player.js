const Card = require('./card');

class Player {
    constructor(id, balance, ws) {
      this.id = id
      this.balance = balance
      this.bet = 0
      this.card0
      this.card1
      this.connection = ws
    }

    setCard0(card) {
        this.card0 = card
    }

    getCard0(){
        return this.card0;
    }

    setCard1(card) {
        this.card1 = card
    }

    getCard1(){
        return card1;
    }

    setBalance(balance) {
        this.balance = balance;
    }

    getBalance() {
        return this.balance;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setBet(bet) {
        this.bet = bet;
        this.balance -= bet; 
    }

    getBet() {
        return this.bet;
    }


  }
  
  module.exports = Player;