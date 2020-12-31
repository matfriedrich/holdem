class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()

    this.view.bindJoin(this.sendJoin)
    this.view.bindAction(this.sendAction)
    this.model.bindPokertableChanged(this.onPokertableChanged)
  }

  sendJoin = () => {
    const message = { type: "join" }
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

  handleJoin(msg) {
    if (msg.status === "fail") {
      alert("Table is already full!")
      return
    }

    this.model.setPlayerId(msg.player.id)
    msg.existingplayers.forEach((element) =>
      this.model.addPlayer(new Player(element))
    )
    this.model.addPlayer(new Player(msg.player.id, msg.player.balance))
    console.log("Player " + msg.player.id + " has joined")

    this.view.removeElement("joinButton")
    this.view.displayTable(this.model.pokertable)
  }

  handleOtherPlayerJoin(msg) {
    this.model.addPlayer(new Player(msg.player.id, msg.player.balance))
    console.log("Player " + msg.player.id + " has joined")
  }

  handleRound(msg) {
    this.model.updatePokertable(msg)
  }

  handleResult(msg) {
    if (isGameWon(msg)) {
      this.model.storeResult(true)
    } else {
      this.model.storeResult(false)
    }
    location.reload()
  }

  onPokertableChanged = (pokertable) => {
    this.view.updateTable(pokertable)
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

function isGameWon(message) {
  if (message.winner === model.getPlayerId()) return true
  else return false
}
