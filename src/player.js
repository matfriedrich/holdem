class Player {
  constructor(id, balance = 1000) {
    console.log("Player")
    this.id = id
    this.balance = balance
    this.card0
    this.card1
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
