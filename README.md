# Holdem
A web-based multiplayer Texas Hold'em game for up to four players.

## How to run
### Prerequisites 
* node.js

### Environment Variables
Following environment variables need to be set before running the server:
* PORT - the port the server will listen on
* WSPORT - the port the websocket will listen on
### Starting the server
node server.js

## How to generate documentation
### Prerequisites
Go to src folder.

`npm install -g jsdoc`
### Documentation
To add documentation for a function, add a block comment in the following style before the function:
```javascript
 /**
   * Send join message
   * @param {string} username - username of the joining player
   * @example
   * sendJoin("john doe")
   */
  sendJoin = (username) => {
    const message = { type: "join", name: username }
    sendMessage(message)
  }
```
[Further information: [JSDoc](https://jsdoc.app/), [CheatSheet](https://devhints.io/jsdoc)]

Afterwards, generate the documentation for all files in **"src"** and store it in the folder **"documentation"** using the command:

`jsdoc -d documentation .`

The result is then available in **"index.html"** in the folder **"documentation"**.

