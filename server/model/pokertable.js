const suits = ["c", "d", "h", "s"]

const values = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"]

const states = {
  idle: 0,
  preflop: 1,
  flop: 2,
  turn: 3,
  river: 4,
  result: 5,
}

const blinds = {
  smallblind: 10,
  bigblind: 20,
}

const actions = {
  raise: 0,
  call: 1,
  check: 2,
  fold: 3,
  allin: 4,
  smallblind: 5,
  bigblind: 6,
  noaction: 7,
}

const options = {
  raise: "Raise",
  call: "Call",
  check: "Check",
  fold: "Fold",
  allin: "All In",
}

const Player = require("./player")
const Card = require("./card")
const { set } = require("mongoose")
const Hand = require("pokersolver").Hand

class PokerTable {
  constructor() {
    this.state
    this.pot = 0
    this.dealer = 0
    this.activePlayer
    this.players = []
    this.flop = []
    this.turn
    this.river
    this.deck = []
    this.options = []
    this.connections = []
    this.lastAction
    this.result
    this.shuffleDeck()
  }

  addPlayer(ws) {
    var status = "fail"
    var newPlayer = new Player(0, 1000, actions.noaction)

    var existingPlayers = []
    this.players.forEach((element) => existingPlayers.push(element.id))

    if (this.players.length < 4) {
      newPlayer.setId(this.players.length)
      this.players.push(newPlayer)
      status = "success"
      this.connections.push(ws)
    }

    var message = {
      type: "join",
      status: status,
      player: newPlayer,
      existingplayers: existingPlayers,
    }

    return message
  }

  shuffleDeck() {
    this.deck = []
    for (var v = 0; v < values.length; v++) {
      for (var s = 0; s < suits.length; s++) {
        this.deck.push(new Card(values[v], suits[s]))
        //console.log("Value " + values[v] + " Suit " + suits[s])
      }
    }
  }

  dealCards() {
    var i

    for (i = 0; i < this.players.length; i++) {
      this.players[i].setCard0(this.selectRandomCard())
      this.players[i].setCard1(this.selectRandomCard())
    }

    for (i = 0; i < 3; i++) {
      this.flop[i] = this.selectRandomCard()
    }

    this.turn = this.selectRandomCard()
    this.river = this.selectRandomCard()
  }

  selectRandomCard() {
    var index = Math.floor(Math.random() * this.deck.length)
    //console.log('index ' + index);
    var card = this.deck[index]
    this.deck.splice(index, 1)
    //console.log('value: ' + card.value + ' suite ' + card.suit);

    return card
  }

  placeBet(player, amount) {
    player.setBet(amount)
    this.pot += amount
  }

  incrementActivePlayer() {
    var i = 1
    while (!this.players[(this.activePlayer + i) % 4]) {
      i++
    }
    this.activePlayer = (this.activePlayer + i) % 4
  }

  incrementDealer() {
    this.dealer = (this.dealer + 1) % 4
  }

  playersLeft() {
    var i = 0
    var playersleft = []

    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].getIsActive()) {
        playersleft.push(this.players[i])
      }
    }
    return playersleft
  }

  startRound() {
    var i

    for (i = 0; i < this.players.length; i++) {
      this.players[i].setBet(0)
      this.players[i].setPrevaction(actions.noaction)
      this.players[i].setIsActive(true)
    }

    this.state = states.preflop
    this.pot = 0
    this.shuffleDeck()
    this.dealCards()
    this.incrementDealer()
    this.lastAction = "New Round"
    this.result = ""
    this.placeBet(this.players[(this.dealer + 1) % 4], blinds.smallblind)
    this.players[(this.dealer + 1) % 4].setPrevaction(actions.smallblind)
    this.placeBet(this.players[(this.dealer + 2) % 4], blinds.bigblind)
    this.players[(this.dealer + 2) % 4].setPrevaction(actions.bigblind)
    this.activePlayer = (this.dealer + 3) % 4

    this.options = [options.raise, options.call, options.fold]
  }

  processAction(msg) {
    if (msg.player !== this.activePlayer) {
      console.log("Action not from active player - something is wrong")
      return "fail"
    }

    this.lastAction = "Player " + this.activePlayer + " " + msg.action

    switch (msg.action) {
      case "Raise":
        break
      case "Call":
        break
      case "Fold":
        this.players[msg.player].setIsActive(false)
        var playersleft = this.playersLeft()
        if (playersleft.length === 1) {
          this.resolveRound(playersleft[0])
          break
        }
        this.incrementActivePlayer()
        break
      case "Check":
        break
    }
  }

  resolveRound(winner) {
    this.result = "Player " + winner.id + " has won " + this.pot
    winner.setBalance(winner.getBalance() + this.pot)
    this.state = states.result
  }

  packTableAsMessage() {
    var flop = [0, 0, 0]
    var turn = 0
    var river = 0

    switch (this.state) {
      case states.flop:
        flop = this.flop
        break
      case states.turn:
        flop = this.flop
        turn = this.turn
        break
      case states.river:
        flop = this.flop
        turn = this.turn
        river = this.river
        break
    }

    var message = {
      type: "tablestatus",
      state: this.state,
      pot: this.pot,
      dealer: this.dealer,
      activePlayer: this.activePlayer,
      players: this.players,
      flop: flop,
      turn: turn,
      river: river,
      options: this.options,
      lastaction: this.lastAction,
      result: this.result,
    }

    return message
  }

  determineWinner() {
    var return_winners = []
    var players_hands = new Map()
    var solved_hands = []
    var converted_flop0 = this.convertCard(this.flop[0])
    var converted_flop1 = this.convertCard(this.flop[1])
    var converted_flop2 = this.convertCard(this.flop[2])
    var converted_turn = this.convertCard(this.turn)
    var converted_river = this.convertCard(this.river)

    for (var i = 0; i < this.players.length; i++) {
      var converted_card0 = this.convertCard(this.players[i].getCard0())
      var converted_card1 = this.convertCard(this.players[i].getCard1())
      var hand = []
      hand.push(
        converted_card0,
        converted_card1,
        converted_flop0,
        converted_flop1,
        converted_flop2,
        converted_turn,
        converted_river
      )
      var solved_hand = Hand.solve(hand)
      players_hands.set(this.players[i], solved_hand)
      solved_hands.push(solved_hand)
    }

    var winners = Hand.winners(solved_hands)

    for (var i = 0; i < this.players.length; i++) {
      if (winners.includes(players_hands.get(this.players[i]))) {
        return_winners.push(this.players[i])
      }
    }
    console.log("Winners:")
    console.log(return_winners)
    return return_winners
  }

  convertCard(card) {
    return card.value.toString().concat(card.suit.toString())
  }
}

module.exports = PokerTable
