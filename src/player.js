/**
 * Player
 */
class Player {
  /**
   * Creates a new Player Object
   * @param {number} id - id of the player
   * @param {number} balance - balance of the player
   */
  constructor(id, balance = 1000) {
    console.log("Player")
    this.id = id
    this.balance = balance
    this.bet
    this.card0
    this.card1
  }

  /**
   * Set first card
   * @param {Card} card
   */
  setCard0(card) {
    this.card0 = card
  }

  /**
   * Get first card
   * @return {Card}
   */
  getCard0() {
    return this.card0
  }

  /**
   * Set second card
   * @param {Card} card
   */
  setCard1(card) {
    this.card1 = card
  }

  /**
   * Get second card
   * @return {Card}
   */
  getCard1() {
    return this.card1
  }

  /**
   * Set balance
   * @param {number} balance
   */
  setBalance(balance) {
    this.balance = balance
  }

  /**
   * Get bet
   * @return {number}
   */
  getBet() {
    return this.bet
  }

  /**
   * Set bet
   * @param {number} bet
   */
  setBet(bet) {
    this.bet = bet
  }
}
