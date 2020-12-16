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

const Player = require('./player');
const Card = require('./card');

class PokerTable {
    constructor() {
      console.log("PokerTable")
      this.pot = 0
      this.game_running = 0
      this.players = []
      this.flop = []
      this.turn
      this.river
      this.deck = []
      this.shuffleDeck();
    }
    addPlayer(ws) {
        var status = 'fail';
        var newPlayer = new Player(0, 1000, ws); 

        var existingPlayers = [];
        this.players.forEach(element => existingPlayers.push(element.id));
        

        if(this.players.length < 4) {
            newPlayer.id = this.players.length + 1;
            this.players.push(newPlayer);
            status = 'success';
        }

        var message = {type: 'join', status: status, player: {id: newPlayer.id, 
            balance: newPlayer.balance}, existingplayers: existingPlayers};

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
            flop[i] = this.selectRandomCard(); 
       }

       this.turn = this.selectRandomCard();
       this.river = this.selectRandomCard();

    }

    selectRandomCard() {
        var index =  Math.floor(Math.random() * 52);
        var card = this.deck[index];
        this.deck = this.deck.splice(index, 1);

        return card;
    }

  }

  
  module.exports = PokerTable;