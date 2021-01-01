const GAMES_TOTAL = "games_total"
const GAMES_WON = "games_won"

class Model {
  constructor() {
    this.pokertable = new PokerTable()
  }

  bindPokertableChanged(callback) {
    this.onPokertableChanged = callback
  }

  setPlayers(players) {
    this.pokertable.setPlayers(players)
  }

  updatePokertable(message) {
    this.pokertable.updatePokertable(message)

    this.onPokertableChanged(this.pokertable)
  }

  storeResult(is_game_won) {
    var gamesTotal = localStorage.getItem(GAMES_TOTAL)
    if (!gamesTotal) gamesTotal = 0
    var gamesWon = localStorage.getItem(GAMES_WON)
    if (!gamesWon) gamesWon = 0

    localStorage.setItem(GAMES_TOTAL, ++gamesTotal)
    if (is_game_won) localStorage.setItem(GAMES_WON, ++gamesWon)
    console.log("TOTAL: " + localStorage.getItem(GAMES_TOTAL))
    console.log("WON:   " + localStorage.getItem(GAMES_WON))
  }

  retrieveResults() {
    var statistics = []
    statistics.push(localStorage.getItem(GAMES_TOTAL))
    statistics.push(localStorage.getItem(GAMES_WON))

    return statistics;
  }

  setPlayerId(id) {
    this.pokertable.setPlayerId(id)
  }

  getPlayerId() {
    return this.pokertable.getPlayerId()
  }
}
