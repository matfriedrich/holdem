const http = require('http')
var node_static = require('node-static');
var WebSocketServer = require('websocket').server;

const Client = require('./model/Client');


const hostname = '127.0.0.1'
const port = process.env.PORT

var file = new(node_static.Server)('../src');

const server = http.createServer((req, res) => {
    file.serve(req, res);
})

wsServer = new WebSocketServer({
    httpServer: server,
    //TODO: should implement CORS check here, wont do
    autoAcceptConnections: true
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
