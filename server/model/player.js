const Card = require('./card');

class Player {
    constructor(id, balance, action, username) {
      this.id = id
      this.balance = balance
      this.bet = 0
      this.card0
      this.card1
      this.prevaction = action
      this.isactive = true
      this.isAllin = false
      this.username = username
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
        return this.card1;
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

    resetBet() {
        this.bet = 0
    }

    setBet(bet) {
        this.bet += bet;
        this.balance -= bet; 
    }

    getBet() {
        return this.bet;
    }

    setPrevaction(action) {
        this.prevaction = action;
    }

    getPrevaction() {
        return this.prevaction;
    }

    setIsActive(bool) {
        this.isactive = bool;
    }

    getIsActive() {
        return this.isactive;
    }

    setIsAllin(bool) {
        this.isAllin = bool;
    }

    getIsAllin() {
        return this.isAllin;
    }


  }
  
  module.exports = Player;