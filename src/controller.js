class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()

    this.view.bindJoin(this.sendJoin)
    this.game_started = 0
  }

  sendJoin = () => {
    const message = {type: 'join'};
    sendMessage(message);
  }

  handleJoin (msg) {
    if(msg.status === 'success') {
      this.model.pokertable.addPlayer(new Player(msg.player, 1000));
    }
    console.log('Player ' + msg.player + ' has joined');
  }

  startGame() {
    // todo
  }

  handleAction() {
    // todo
  }

  handleResult() {

  }

  
}

let c = new Controller();

const testObject = {username: 'testuser', ip: '192.168.0.1'};

let connection = new WebSocket('ws://localhost:8080' , ['soap', 'xmpp']);

// When the connection is open, send some data to the server
connection.onopen = function () {
    connection.send(JSON.stringify(testObject)); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
    console.log('Server: ' + e.data);

    var msg = JSON.parse(e.data);

    switch(msg.type) {
      case "join":
        c.handleJoin(msg);
        break;
      case "action":
        c.handleAction();
        break;
      case "result":
        c.handleResult();
        break;
    }
};

function sendMessage(message) {
  connection.send(JSON.stringify(message));
}