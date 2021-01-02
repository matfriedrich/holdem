class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()

    this.view.bindJoin(this.sendJoin)
    this.view.bindStatistics(this.showStatistics)
    this.view.bindAction(this.sendAction)
    this.view.bindDrop(this.sendAllin)
    this.model.bindPokertableChanged(this.onPokertableChanged)
  }

  sendJoin = (username) => {
    const message = { type: "join", name: username }
    sendMessage(message)
  }

  sendAction = (action) => {
    const message = {
      type: "action",
      player: this.model.getPlayerId(),
      action: action,
    }
    sendMessage(message)
  }

  sendAllin = (ev) => {
    var data = ev.dataTransfer.getData("text")
    console.log("data " + data)
    ev.target.appendChild(document.getElementById(data))

    const message = {
      type: "action",
      player: this.model.getPlayerId(),
      action: "All In",
    }
    sendMessage(message)
  }

  showStatistics = () => {
    var statistics = this.model.retrieveResults()
    var losses = statistics[0] - statistics[1]
    var winrate = 0
    if (statistics[0] != 0)
      winrate = Math.round((statistics[1] / statistics[0]) * 100)

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
    )
  }

  handleJoin(msg) {
    if (msg.status === "fail") {
      alert("Table is already full!")
      return
    }

    this.model.setPlayerId(msg.player.id)
    this.model.setPlayers(msg.existingplayers)
    console.log("Player " + msg.player.username + " has joined")

    this.view.displayTable(this.model.pokertable)
  }

  handleOtherPlayerJoin(msg) {
    this.model.setPlayers(msg.existingplayers)
    console.log("Player " + msg.player.username + " has joined")
  }

  handleRound(msg) {
    this.model.updatePokertable(msg)
  }

  handleResult(msg) {
    if (this.isGameWon(msg)) {
      this.model.storeResult(true)
      alert("You won the game! Congratulations")
    } else {
      this.model.storeResult(false)
      alert("Player " + msg.winner + " has won")
    }
    location.reload()
  }

  onPokertableChanged = (pokertable) => {
    this.view.updateTable(pokertable)
  }

  isGameWon(message) {
    if (message.winner === this.model.getPlayerId()) return true
    else return false
  }
}

let c = new Controller()

const testObject = { username: "testuser", ip: "192.168.0.1" }

let connection = new WebSocket("ws://localhost:8080", ["soap", "xmpp"])

// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send(JSON.stringify(testObject)) // Send the message 'Ping' to the server
}

// Log errors
connection.onerror = function (error) {
  console.log("WebSocket Error " + error)
}

// Log messages from the server
connection.onmessage = function (e) {
  console.log("Server: " + e.data)

  var msg = JSON.parse(e.data)

  switch (msg.type) {
    case "join":
      c.handleJoin(msg)
      break
    case "otherJoin":
      c.handleOtherPlayerJoin(msg)
      break
    case "tablestatus":
      c.handleRound(msg)
      break
    case "game_result":
      c.handleResult(msg)
      break
  }
}

function sendMessage(message) {
  connection.send(JSON.stringify(message))
}
