const GAMES_TOTAL = "games_total";
const GAMES_WON = "games_won";
const PLAYER_ID = "user_id";
const PLAYER_NAME = "player_name"
class Model {
  /**
   * Creates a new Model Object
   */
  constructor() {
    this.pokertable = new PokerTable();
  }

  /**
   * Bind onPokertableChanged to callback
   * @param {function} callback - function to call when pokertable changes
   */
  bindPokertableChanged(callback) {
    this.onPokertableChanged = callback;
  }

  /**
   * Bind onFlopChanged to callback
   * @param {function} callback - function to call when Flop changes
   */
  bindBoardChanged(callback) {
    this.onBoardChanged = callback;
  }

  /**
   * Bind onPlayersChanged to callback
   * @param {function} callback - function to call when players change
   */
  bindPlayersChanged(callback) {
    this.onPlayersChanged = callback;
  }

  /**
   * Set players on pokertable
   * @param {Player[]} players - array of players to set on the pokertable
   */
  setPlayers(players) {
    this.pokertable.setPlayers(players);

    this.onPlayersChanged(this.pokertable); //notify view
  }

  /**
   * Update pokertable and trigger onPokertableChanged, onFlopChanged, onRiverChanged and onTurnChanged
   * @param {*} message - new pokertable status
   */
  updatePokertable(message) {
    if (this.pokertable.flop !== message.flop) {
      this.onBoardChanged(message.flop, message.turn, message.river);
    } else if (this.pokertable.river !== message.river) {
      this.onBoardChanged(message.flop, message.turn, message.river);
    } else if (this.pokertable.turn !== message.turn) {
      this.onBoardChanged(message.flop, message.turn, message.river);
    }

    //update Pokertable AFTER checking changes on Board!
    this.pokertable.updatePokertable(message);
    this.onPokertableChanged(this.pokertable);
  }

  /**
   * Store the game result in localStorage
   * @param {boolean} is_game_won - true if game was won, otherwise false
   */
  storeResult(is_game_won) {
    var gamesTotal = localStorage.getItem(GAMES_TOTAL);
    if (!gamesTotal) gamesTotal = 0;
    var gamesWon = localStorage.getItem(GAMES_WON);
    if (!gamesWon) gamesWon = 0;

    localStorage.setItem(GAMES_TOTAL, ++gamesTotal);
    if (is_game_won) localStorage.setItem(GAMES_WON, ++gamesWon);
    console.log("TOTAL: " + localStorage.getItem(GAMES_TOTAL));
    console.log("WON:   " + localStorage.getItem(GAMES_WON));
  }

  /**
   * Get results from localStorage and put them in an array
   * @return {number[]} - first: total games, second: won games
   */
  retrieveResults() {
    var statistics = [];
    var gamesTotal = localStorage.getItem(GAMES_TOTAL);
    if (!gamesTotal) gamesTotal = 0;
    var gamesWon = localStorage.getItem(GAMES_WON);
    if (!gamesWon) gamesWon = 0;

    statistics.push(gamesTotal);
    statistics.push(gamesWon);

    return statistics;
  }

  /**
   * Store current session in local storage to be able to rejoin a game
   * @param {string} playerName
   * @param {integer} playerId
   */

  storePlayerSession(playerName, playerId) {
    sessionStorage.setItem(PLAYER_ID, playerId);
    sessionStorage.setItem(PLAYER_NAME, playerName);
    return;
  }

  /**
   * retrieve player object from session storage for rejoining
   * @returns {null|{name: string, id: string}}
   */
  retrievePlayerSession() {
    var id = sessionStorage.getItem(PLAYER_ID);
    var name = sessionStorage.getItem(PLAYER_NAME);

    if (id == undefined ||name == undefined) return null;

    return {id: id, name: name};
  }

  /**
   * delete player object from session storage after game is over
   */
  deletePlayerSession() {
    sessionStorage.removeItem(PLAYER_ID);
    sessionStorage.removeItem(PLAYER_NAME);
  }

  /**
   * Set id of player
   * @param {number} id
   */
  setPlayerId(id) {
    this.pokertable.setPlayerId(id);
  }

  /**
   * Get player id
   * @return {number} id
   */
  getPlayerId() {
    return this.pokertable.getPlayerId();
  }
}
