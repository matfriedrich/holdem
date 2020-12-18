const suits = {
    clubs: 0,
    diamonds: 1,
    hearts: 2,
    spades: 3,
  }
  
const values = {
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 11,
    queen: 12,
    king: 13,
    ace: 14,
  }

const states = {
    idle: 0,
    preflop: 1,
    flop: 2,
    turn: 3,
    river: 4,
    result: 5
}

const blinds = {
    smallblind: 10,
    bigblind: 20
}

const actions = {
    raise: 0,
    call: 1,
    check: 2,
    fold: 3,
    allin: 4,
    smallblind: 5,
    bigblind: 6,
    noaction: 7
}

const options = {
    raise: 'Raise',
    call: 'Call',
    check: 'Check',
    fold: 'Fold',
    allin: 'All In'
}

const Player = require('./player');
const Card = require('./card');

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
      this.shuffleDeck();
    }

    addPlayer(ws) {
        var status = 'fail';
        var newPlayer = new Player(0, 1000, actions.noaction); 

        var existingPlayers = [];
        this.players.forEach(element => existingPlayers.push(element.id));
        

        if(this.players.length < 4) {
            newPlayer.setId(this.players.length);
            this.players.push(newPlayer);
            status = 'success';
            this.connections.push(ws);
        }

        var message = {type: 'join', status: status, player: newPlayer, existingplayers: existingPlayers};

        return message;
    }

    shuffleDeck() {
        this.deck = []; 
        for(var suit in suits) {
            for(var value in values) {
                this.deck.push(new Card(value, suit));
                //console.log('Value ' + value + ' Suit ' + suit);
            }
        }
    }

    dealCards() {
       var i;

       for(i = 0; i < this.players.length; i++) {
           this.players[i].setCard0(this.selectRandomCard());
           this.players[i].setCard1(this.selectRandomCard());
       }
       
       for(i = 0; i < 3; i++) {
            this.flop[i] = this.selectRandomCard(); 
       }

       this.turn = this.selectRandomCard();
       this.river = this.selectRandomCard();
    }

    selectRandomCard() {
        var index =  Math.floor(Math.random() * this.deck.length);
        //console.log('index ' + index);
        var card = this.deck[index];
        this.deck.splice(index, 1);
        //console.log('value: ' + card.value + ' suite ' + card.suit);

        return card;
    }

    startRound(msg = null) {
        if(msg === null) {
            this.dealCards();
            this.players[this.dealer + 1].setBet(blinds.smallblind);
            this.players[this.dealer + 1].setPrevaction(actions.smallblind);
            this.players[this.dealer + 2].setBet(blinds.bigblind);
            this.players[this.dealer + 2].setPrevaction(actions.bigblind);
            this.activePlayer = (this.dealer + 3);

            this.options = [options.raise, options.call, options.fold];

            return this.packTableAsMessage();
        }
    }

    processAction(msg) {
        if(msg.player !== this.activePlayer) {
            console.log('Action not from active player - something is wrong');
            return 'fail'; 
        }

        switch(msg.action) {
            case 'Raise': 
                break;
            case 'Call': 
                break;
            case 'Fold': 

                break;
            case 'Check': 
                break;
        }



        return this.packTableAsMessage();
    }

    packTableAsMessage() {
        var flop = [0, 0, 0]; 
        var turn = 0;
        var river = 0;

        switch(this.state) {
            case states.flop: 
                flop = this.flop;
                break;
            case states.turn: 
                flop = this.flop;
                turn = this.turn;
                break;
            case states.river: 
                flop = this.flop;
                turn = this.turn;
                river = this.river;
                break;
        }

        var message  = {type: 'tablestatus', state: this.state, pot: this.pot, 
            dealer: this.dealer, activePlayer: this.activePlayer, players: this.players,
            flop: flop, turn: turn, river: river, options: this.options};

        return message;
    }

    determineWinner(handslist) {
        
    }

  }

  
  module.exports = PokerTable;