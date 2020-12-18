class View {
  constructor() {
    this.app = this.getElement('#root');
    
    this.title = this.createElement('h1');
    this.title.textContent = 'Texas Holdem';

    this.main = this.createElement('div');
    this.main.className = 'flex-container';
    this.tableTitle = this.createElement('h2');
    this.tableTitle.textContent = 'Table';

    this.canvas = this.createElement('div');
    this.canvas.id = 'canvas';
    this.options = this.createElement('div');
    this.options.id = 'options'

    this.joinButton = this.createElement('Button');
    this.joinButton.id = 'joinButton';
    this.joinButton.textContent = 'Join Game';

    this.main.append(this.joinButton);
    this.app.append(this.title, this.main);

  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if(className) {
      element.classList.add(className);
    }

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  removeElement(id) {
    var element = document.getElementById(id);
    if(element !== null) {
      element.parentNode.removeChild(element);
    }
    
  }

  bindJoin(handler){
    this.joinButton.addEventListener('click', event => {
      event.preventDefault();

      handler();
    })
  }

  bindAction(handler){
    this.options.addEventListener('click', event => {

      handler(event.target.textContent);
    })
  }

  displayTable(pokertable) {
    // Todo: Canvas stuff 
    this.main.append(this.tableTitle, this.canvas, this.options);
  }

  updateTable(pokertable) {
    // Todo: Canvas stuff 

    
    while(this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
    }
    while(this.options.firstChild) {
      this.options.removeChild(this.options.firstChild);
    }

    var pot = this.createElement('p');
    pot.textContent = 'Pot: ' + pokertable.pot.toString();

    var flop = this.createElement('p');
    flop.textContent = 'First: ' + pokertable.flop[0] + ' Second: ' + pokertable.flop[1] +
      ' Third: ' + pokertable.flop[2]; 

    var turn = this.createElement('p');
    turn.textContent = 'Turn: ' + pokertable.turn;

    var river = this.createElement('p');
    river.textContent = 'River: ' + pokertable.river;

    var players = [];
    var i;

    for(i = 0; i < pokertable.players.length; i++) {
      players.push(this.createElement('p'));
      players[i].textContent = 'Player ' + pokertable.players[i].id.toString() + ' Balance: ' + 
      pokertable.players[i].balance.toString() + ' Card0: ' + pokertable.players[i].card0.value +
        ' ' + pokertable.players[i].card0.suit + ' Card1: ' + pokertable.players[i].card1.value +
        ' ' + pokertable.players[i].card1.suit + ' Bet: ' + pokertable.players[i].bet;
    }

    var lastaction = this.createElement('p'); 
    lastaction.textContent = pokertable.lastAction;
    
    var result = this.createElement('p'); 
    result.textContent = pokertable.result;

    
    this.canvas.append(pot, flop, turn, river, players[0], 
      players[1], players[2], players[3], lastaction, result);
    
    var j; 

    if(pokertable.isActivePlayer) {
      for(j = 0; j < pokertable.options.length; j++) {
        var button = this.createElement('button');
        button.textContent = pokertable.options[j];
        this.options.append(button);
      }
    }
  }
}


/*<button onclick="c.joinGame()">Join Table</button>
    <div class="header"><h1>Texas Holdem Poker</h1></div>
    <div class="flex-container">
      <div id="canvas"><h2>canvas</h2></div>
      <div id="bottom"><h2>bottom</h2></div>
    </div>*/