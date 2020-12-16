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

  displayTable(pokertable) {
    // Todo: Canvas stuff 
    this.main.append(this.tableTitle, this.canvas, this.options);
  }

  updateTable(pokertable) {
    // Todo: Canvas stuff 

    
    while (this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
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

    var player1 = this.createElement('p');
    player1.textContent = 'Player ' + pokertable.players[0].id.toString(); 

    var player2 = this.createElement('p');
    player2.textContent = 'Player ' + pokertable.players[1].id.toString(); 

    var player3 = this.createElement('p');
    player3.textContent = 'Player ' + pokertable.players[2].id.toString(); 

    var player4 = this.createElement('p');
    player4.textContent = 'Player ' + pokertable.players[3].id.toString(); 

    this.canvas.append(pot, flop, turn, river, player1, 
      player2, player3, player4);
  }
}


/*<button onclick="c.joinGame()">Join Table</button>
    <div class="header"><h1>Texas Holdem Poker</h1></div>
    <div class="flex-container">
      <div id="canvas"><h2>canvas</h2></div>
      <div id="bottom"><h2>bottom</h2></div>
    </div>*/