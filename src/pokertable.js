const actions = {
  raise: 0,
  call: 1,
  check: 2,
  fold: 3,
  allin: 4,
  smallblind: 5,
  bigblind: 6,
  noaction: 7,
}

class PokerTable {
  /**
   * Creates a new PokerTable Object
   */
  constructor() {
    console.log("PokerTable")
    this.pot = 0
    this.dealerId = 0
    this.game_running = 0
    this.playerId
    this.players = []
    this.playersLost = []
    this.isActivePlayer
    this.flop = []
    this.river
    this.turn
    this.options
    this.lastAction
    this.result
  }

  /**
   * Update the players
   * @param {*} players Array of player objects
   */
  setPlayers(players) {
    this.players = players
  }

  /**
   * Update the pokertable
   * @param {*} msg message of type "tablestatus"
   */
  updatePokertable(msg) {
    this.pot = msg.pot
    this.isActivePlayer = false

    if (this.playerId == msg.activePlayer) {
      this.isActivePlayer = true
    }

    this.playersLost = msg.playersLost

    this.players = msg.players

    this.dealerId = msg.dealerId

    this.flop = msg.flop
    this.turn = msg.turn
    this.river = msg.river

    this.options = msg.options
    this.lastAction = msg.lastaction
    this.result = msg.result
  }

  /**
   * Set id of the player
   * @param {*} id Id of the player
   */
  setPlayerId(id) {
    this.playerId = id
  }

  /**
   * Returns playerId
   * @return {number} playerId
   */
  getPlayerId() {
    return this.playerId
  }
}
