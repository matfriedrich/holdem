const suits = {
  clubs: 0,
  diamonds: 1,
  hearts: 2,
  spades: 3,
}

const values = {
  /*2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,*/
  jack: 11,
  queen: 12,
  king: 13,
  ace: 14,
}

class Card {
  constructor(value = values.ace, suit = suits.spades) {
    console.log("Card")
    this.value
    this.suit
  }
}
