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
    this.winningHand = ""
    this.playersToRemove = []
    this.shuffleDeck()
  }

  addPlayer(ws, username) {
    var status = "fail"
    var newPlayer = new Player(0, 1000, actions.noaction, username)

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
      existingplayers: this.players,
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
    while (
      !this.players[(this.activePlayer + i) % this.players.length].getIsActive()
    ) {
      i++
    }
    this.activePlayer = (this.activePlayer + i) % this.players.length
  }

  getNextActivePlayer() {
    var i = 1
    while (
      !this.players[(this.activePlayer + i) % this.players.length].getIsActive()
    ) {
      i++
    }
    return (this.activePlayer + i) % this.players.length
  }

  isNextPlayerBalanceEnoughForCall() {
    var next = this.getNextActivePlayer()
    var rest_to_bet = this.currentHighestBet - this.players[next].getBet()
    if (this.players[next].getBalance() > rest_to_bet) return true
    else return false
  }

  isNextPlayerBalanceEnoughForRaise() {
    var next = this.getNextActivePlayer()
    var rest_to_bet = this.currentHighestBet * 2 - this.players[next].getBet()
    if (this.players[next].getBalance() > rest_to_bet) return true
    else return false
  }

  incrementDealer() {
    this.dealer = (this.dealer + 1) % this.players.length
  }

  playersLeft() {
    var i = 0
    var playersleft = []

    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].getIsActive() || this.players[i].getIsAllin()) {
        playersleft.push(this.players[i])
      }
    }
    return playersleft
  }

  playersLeftWithAction() {
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
      this.players[i].setIsAllin(false)
    }

    this.playersToRemove = []
    this.state = states.preflop
    this.pot = 0
    this.shuffleDeck()
    this.dealCards()
    this.incrementDealer()
    this.lastAction = "New Round"
    this.result = ""
    this.placeBet(
      this.players[(this.dealer + 1) % this.players.length],
      blinds.smallblind
    )
    this.players[(this.dealer + 1) % this.players.length].setPrevaction(
      actions.smallblind
    )
    this.placeBet(
      this.players[(this.dealer + 2) % this.players.length],
      blinds.bigblind
    )
    this.players[(this.dealer + 2) % this.players.length].setPrevaction(
      actions.bigblind
    )
    this.currentHighestBet = blinds.bigblind
    this.activePlayer = (this.dealer + 3) % this.players.length

    this.setNextPlayersOptions()
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
    console.log("checking if everonye made turn")
    var i
    for (i = 0; i < this.players.length; i++) {
      var prevact = this.players[i].getPrevaction()
      if (
        (this.players[i].getIsActive() &&
          (prevact == actions.noaction || prevact == actions.bigblind)) ||
        prevact == actions.smallblind
      ) {
        console.log("not everyone made turn")
        return false
      }
    }
    return true
  }

  checkAllBetsAreSame() {
    console.log("checking if all bets are same")
    var i
    for (i = 0; i < this.players.length; i++) {
      if (
        this.players[i].getIsActive() &&
        this.players[i].getBet() != this.currentHighestBet
      ) {
        console.log("not all bets are same")
        return false
      }
    }
    return true
  }

  checkEveryoneIsAllin() {
    console.log("checking if everyone is all in")
    var i
    for (i = 0; i < this.players.length; i++) {
      if (!this.players[i].getIsAllin()) {
        console.log("not everyone is all in")
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

    this.lastAction = this.players[msg.player].getUsername() + " " + msg.action

    switch (msg.action) {
      case options.raise:
        this.players[msg.player].setPrevaction(actions.raise)
        if (this.currentHighestBet == 0) {
          this.currentHighestBet = 20
        }
        this.currentHighestBet *= 2
        this.placeBet(
          this.players[msg.player],
          this.currentHighestBet - this.players[msg.player].getBet()
        )
        this.setNextPlayersOptions()
        this.incrementActivePlayer()
        break

      case options.call:
        this.players[msg.player].setPrevaction(actions.call)
        this.setNextPlayersOptions()
        var difference =
          this.currentHighestBet - this.players[this.activePlayer].getBet()
        this.placeBet(this.players[msg.player], difference)

        if (this.checkEveryoneMadeTurn() && this.checkAllBetsAreSame()) {
          this.state++
          this.resetPlayerForTurn()
          this.activePlayer = this.dealer
        }
        this.incrementActivePlayer()
        if (
          this.playersLeftWithAction().length === 0 ||
          this.state == states.result
        ) {
          var winners = this.determineWinner()
          this.resolveRound(winners)
        }
        break
      case options.allin:
        this.players[msg.player].setPrevaction(actions.allin)
        this.players[msg.player].setIsActive(false)
        this.players[msg.player].setIsAllin(true)

        this.placeBet(
          this.players[msg.player],
          this.players[msg.player].getBalance()
        )

        if (this.players[msg.player].getBet() > this.currentHighestBet) {
          this.currentHighestBet = this.players[msg.player].getBet()
        }

        if (this.playersLeftWithAction().length >= 1)
          this.setNextPlayersOptions()

        if (this.checkEveryoneMadeTurn() && this.checkAllBetsAreSame()) {
          this.state++
          this.resetPlayerForTurn()
          this.activePlayer = this.dealer
        }
        if (this.playersLeftWithAction().length >= 1)
          this.incrementActivePlayer()
        if (this.checkEveryoneIsAllin() || this.state == states.result) {
          var winners = this.determineWinner()
          this.resolveRound(winners)
        }
        break
      case options.fold:
        this.players[msg.player].setIsActive(false)
        if (this.playersLeftWithAction().length >= 1)
          this.setNextPlayersOptions()

        var playersleft = this.playersLeft()
        console.log("Players left " + playersleft.length)
        console.log(
          "players left with action " + this.playersLeftWithAction().length
        )
        if (playersleft.length === 1) {
          this.resolveRound(playersleft)
          break
        } else if (this.playersLeftWithAction().length === 0) {
          var winners = this.determineWinner()
          this.resolveRound(winners)
          break
        }

        this.incrementActivePlayer()
        break
      default:
        return
    }
  }

  setNextPlayersOptions() {
    this.options = []
    if (this.isNextPlayerBalanceEnoughForRaise())
      this.options.push(options.raise)
    if (this.isNextPlayerBalanceEnoughForCall()) this.options.push(options.call)
    this.options.push(options.fold)
    this.options.push(options.allin)
  }

  resolveRound(winners) {
    console.log("Resolving round")
    var i
    for (i = 0; i < winners.length; i++) {
      winners[i].setBalance(winners[i].getBalance() + this.pot / winners.length)
      this.result +=
        "Player " +
        winners[i].getId() +
        " has won " +
        this.pot / winners.length +
        " " +
        this.winningHand
      console.log(this.result)
    }
    this.state = states.result
    this.options = []
    this.removePlayersWithoutBalance()
  }

  removePlayersWithoutBalance() {
    var i = this.players.length
    while (i--) {
      if (this.players[i].getBalance() <= 0) {
        this.playersToRemove.push(i)
        this.players.splice(i, 1)
      }
    }
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
      case states.result:
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
      playerToRemove: this.playersToRemove,
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
      if (this.players[i].getIsActive() || this.players[i].getIsAllin()) {
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
