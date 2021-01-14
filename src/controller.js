class Controller {
  /**
   * Creates a new Controller Object
   */
  constructor() {
    this.model = new Model();
    this.view = new View();

    this.view.bindJoin(this.sendJoin);
    this.view.bindStatistics(this.showStatistics);
    this.view.bindAction(this.sendAction);
    this.view.bindDrop(this.sendAllin);
    this.model.bindPokertableChanged(this.onPokertableChanged);
    this.model.bindBoardChanged(this.onBoardChanged);
    this.model.bindPlayersChanged(this.onPlayersChanged);
  }

  /**
   * Send join message
   * @param {string} username - username of the joining player
   * @example
   * sendJoin("john doe")
   */
  sendJoin = (username) => {
    const message = { type: "join", name: username};
    sendMessage(message);
  };

  /**
   * Send rejoin message
   * (same as join, but with existing session -> including plaer id
   *
   */
  sendRejoin = (session) => {
    const message = { type: "join", name: session.name, id: session.id };
    sendMessage(message);
  }

  /**
   * Send action message
   * @param {string} action - string that describes the action
   */
  sendAction = (action) => {
    const message = {
      type: "action",
      player: this.model.getPlayerId(),
      action: action,
    };
    sendMessage(message);
  };

  /**
   * Send all in message
   * @param {Event} ev - event of AllIn Drop
   */
  sendAllin = (ev) => {
    var data = ev.dataTransfer.getData("text");
    console.log("data " + data);
    ev.target.appendChild(document.getElementById(data));

    const message = {
      type: "action",
      player: this.model.getPlayerId(),
      action: "All In",
    };
    sendMessage(message);
  };

  /**
   * Show game statistics in an alert message
   */
  showStatistics = () => {
    var statistics = this.model.retrieveResults();
    var losses = statistics[0] - statistics[1];
    var winrate = 0;
    if (statistics[0] != 0)
      winrate = Math.round((statistics[1] / statistics[0]) * 100);

    alert(
      "Total Games played: " +
        statistics[0] +
        "\n" +
        "Games Won: " +
        statistics[1] +
        "\n" +
        "Games Lost: " +
        losses +
        "\n" +
        "Win rate: " +
        winrate +
        "%"
    );
  };

  /**
   * Handle "join" message from server
   * @param {*} msg - message of type "join" from server
   */
  handleJoin(msg) {
    if (msg.status === "fail") {
      alert("Table is already full!");
      return;
    }

    this.model.setPlayerId(msg.player.id);
    this.model.storePlayerSession(msg.player.username, msg.player.id);
    this.model.setPlayers(msg.existingplayers);
    console.log("Player " + msg.player.username + " has joined");

    this.view.displayTable(this.model.pokertable);
  }

  /**
   * Handle "otherJoin" message from server
   * @param {*} msg - message of type "otherJoin"
   */
  handleOtherPlayerJoin(msg) {
    this.model.setPlayers(msg.existingplayers);
    console.log("Player " + msg.player.username + " has joined");
  }

  /**
   * Handle "tablestatus" message from server
   * @param {*} msg - message of type "tablestatus"
   */
  handleRound(msg) {
    this.model.updatePokertable(msg);
  }

  /**
   * Handle "gameResult" message from server
   * @param {*} msg - message of type "gameResult"
   */
  handleResult(msg) {
    if (this.isGameWon(msg)) {
      this.model.storeResult(true);
      alert("You won the game! Congratulations");
    } else {
      this.model.storeResult(false);
      alert("Player " + msg.winner + " has won");
    }

    this.model.deletePlayerSession();

    setTimeout(function () {
      location.reload();
    }, 3000);
  }

  /**
   * Update pokertable if something changed
   * @param {PokerTable} pokertable - pokertable to update
   */
  onPokertableChanged = (pokertable) => {
    this.view.updateTable(pokertable);
  };

  /**
   * Update Board if it changed
   * @param {Array} flop - Flop to update
   * @param {Card} turn - Turn card to update
   * @param {Card} river - River card to update
   */
  onBoardChanged = (flop, turn, river) => {
    this.view.updateBoard(flop, turn, river);
  };

  /**
   * Update pokertable if players changed (e.g. joined)
   * @param {PokerTable} pokertable - pokertable to update
   */
  onPlayersChanged = (pokertable) => {
    this.view.updatePlayers(pokertable);
  };

  /**
   * Checks if player is the winner by looking at the result message
   * @param {*} message - result message
   * @return {boolean} - true if player is winner, otherwise false
   */
  isGameWon(message) {
    if (message.winner === this.model.getPlayerId()) return true;
    else return false;
  }
}

let c = new Controller();

const testObject = { username: "testuser", ip: "192.168.0.1" };

let baseUrl = window.location.host.split(':')[0];

let connection = new WebSocket("ws://" + baseUrl + ":8080", ["soap", "xmpp"]);
/**
 * When the connection is open, send some data to the server
 */
connection.onopen = function () {
  connection.send(JSON.stringify(testObject)); // Send the message 'Ping' to the server

  // if there is a previous session: rejoin
  var savedPlayerSession = c.model.retrievePlayerSession();
  if (savedPlayerSession !== null) c.sendRejoin(savedPlayerSession)
};

/**
 * Log error
 * @param {*} error
 */
connection.onerror = function (error) {
  console.log("WebSocket Error " + error);
};

/**
 * Log messages from the server
 * @param {Event} e
 */
connection.onmessage = function (e) {
  console.log("Server: " + e.data);

  var msg = JSON.parse(e.data);

  switch (msg.type) {
    case "join":
      c.handleJoin(msg);
      break;
    case "otherJoin":
      c.handleOtherPlayerJoin(msg);
      break;
    case "tablestatus":
      c.handleRound(msg);
      break;
    case "gameResult":
      c.handleResult(msg);
      break;
  }
};

/**
 * Send message over connection
 * @param {*} message - object to send
 */
function sendMessage(message) {
  connection.send(JSON.stringify(message));
}
