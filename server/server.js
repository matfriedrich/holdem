const http = require("http");
const { STATES } = require("mongoose");
var node_static = require("node-static");
const WebSocket = require("ws");
const Client = require("./model/Client");
const PokerTable = require("./model/pokertable");
pokerTable = new PokerTable();

const hostname = "127.0.0.1";
const webserverPort = process.env.PORT || 8088;
const websocketPort = process.env.WSPORT || 8080;

var file = new node_static.Server("../src");

const server = http.createServer((req, res) => {
  file.serve(req, res);
});

const wss = new WebSocket.Server({
  port: websocketPort,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed.
  },
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", JSON.parse(message));

    handleMessage(ws, message);
  });
});

server.listen(webserverPort, () => {
  console.log(`Server running at http://${hostname}:${webserverPort}/`);
});

function handleMessage(ws, message) {
  const msg = JSON.parse(message);

  switch (msg.type) {
    case "join":
      //console.log('Received join from client');
      var playerId = pokerTable.addPlayer(msg.name, msg.id);
      if (playerId >= 0) pokerTable.addConnection(ws);
      var joinMessageForJoiner = pokerTable.getJoinMessageForJoiner(
          playerId
      );
      ws.send(JSON.stringify(joinMessageForJoiner));
      if (playerId >= 0) {
        var joinMessageForOthers = pokerTable.getJoinMessageForOthers(playerId);
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(joinMessageForOthers));
          }
        });
        if (pokerTable.players.length === 4) {
          setTimeout(function () {
            pokerTable.startRound();
            var payload = pokerTable.packTableAsMessage();
            pokerTable.connections.forEach(function each(player) {
              player.send(JSON.stringify(payload));
            });
          }, 1000);
        }
      }

      break;
    case "action":
      pokerTable.processAction(msg);
      var payload = pokerTable.packTableAsMessage(msg);
      pokerTable.connections.forEach(function each(player) {
        player.send(JSON.stringify(payload));
      });

      if (pokerTable.state === 5 && pokerTable.players.length > 1) {
        setTimeout(function () {
          pokerTable.startRound(msg);
          var payload = pokerTable.packTableAsMessage(msg);
          pokerTable.connections.forEach(function each(player) {
            player.send(JSON.stringify(payload));
          });
        }, 10000); //if round ends, make timeout here so that the new message that forces the client to update isn't sent too early
      }

      if (pokerTable.players.length === 1) {
        // player has won
        var message = {
          type: "gameResult",
          winner: pokerTable.players[0].getId(),
        };
        pokerTable.connections.forEach(function each(player) {
          player.send(JSON.stringify(message));
        });

        pokerTable = new PokerTable();
      }
      break;
  }
}
