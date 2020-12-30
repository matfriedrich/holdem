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
  call: "Call/Check",
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
    this.currentHighestBet
    this.winningHand
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
    while (!this.players[(this.activePlayer + i) % 4].getIsActive()) {
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
      this.players[i].resetBet()
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
    this.currentHighestBet = blinds.bigblind
    this.activePlayer = (this.dealer + 3) % 4

    this.options = [options.raise, options.call, options.fold]
  }

  resetPlayerForTurn() {
    var i
    for (i = 0; i < this.players.length; i++) {
      this.players[i].resetBet()
      this.players[i].setPrevaction(actions.noaction)
    }
    this.currentHighestBet = 0
  }

  checkEveryoneMadeTurn() {
    console.log('checking if everonye made turn')
    var i
    for (i = 0; i < this.players.length; i++) {
      var prevact = this.players[i].getPrevaction()
      if(this.players[i].getIsActive() && (prevact == actions.noaction || 
          prevact == actions.bigblind) || prevact == actions.smallblind) {
        console.log('not everyone made turn')
        return false
      }
    }
    return true
  }

  checkAllBetsAreSame() {
    console.log('checking if all bets are same')
    var i
    for (i = 0; i < this.players.length; i++) {
      if(this.players[i].getIsActive() && this.players[i].getBet() != this.currentHighestBet) {
        console.log('not all bets are same')
        return false
      }
    }
    return true
  }

  processAction(msg) {
    if (msg.player !== this.activePlayer) {
      console.log("Action not from active player - something is wrong")
      return "fail"
    }

    this.lastAction = "Player " + this.activePlayer + " " + msg.action

    switch (msg.action) {
      case "Raise":
        this.players[msg.player].setPrevaction(actions.raise)
        if(this.currentHighestBet = 0) { 
          this.currentHighestBet = 40
        }
        this.currentHighestBet *= 2
        this.placeBet(this.players[msg.player], this.currentHighestBet - this.players[msg.player].getBet())
        this.incrementActivePlayer() 
        break

      case "Call/Check":
        this.players[msg.player].setPrevaction(actions.call)
        var difference = this.currentHighestBet - this.players[this.activePlayer].getBet()
        this.placeBet(this.players[msg.player], difference)
        
        if(this.checkEveryoneMadeTurn() && this.checkAllBetsAreSame()) {
          this.state++
          this.resetPlayerForTurn()
          this.activePlayer = this.dealer
        }
        
        this.incrementActivePlayer() 

        if(this.state == states.result) {
          var winners = this.determineWinner()
          this.resolveRound(winners)
        }


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
    }
  }

  resolveRound(winners) {
    var i
    for (i = 0; i < winners.length; i++) {
      winners[i].setBalance(winners[i].getBalance() + this.pot/winners.length)
      this.result += "Player " + winners[i].getId() + " has won " + this.pot/winners.length + ' ' + this.winningHand
    }
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
      if(this.players[i].getIsActive()) {
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
    }

    var winners = Hand.winners(solved_hands)
    this.winningHand = winners[0].descr

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
