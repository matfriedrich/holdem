class Player {
  constructor(id, balance = 1000) {
    console.log("Player")
    this.id = id
    this.balance = balance
    this.bet
    this.card0
    this.card1
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

  getBet() {
    return this.bet;
  }

  setBet(bet) {
    this.bet = bet;
  }
}
