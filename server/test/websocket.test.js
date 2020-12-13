// #!/usr/bin/env node
//
// const WebSocket = require('ws');
//
// const ws = new WebSocket('ws://localhost:' + process.env.WSPORT);
//
// ws.on('open', function open() {
//     ws.send('test body');
// });
//
// ws.on('message', function incoming(data) {
//     console.log(data);
// });
//


const testObject = {username: 'testuser', ip: '192.168.0.1'};

var connection = new WebSocket('ws://localhost:8080' , ['soap', 'xmpp']);

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
};
