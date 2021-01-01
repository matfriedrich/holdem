class View {
  constructor() {
    this.app = this.getElement('#root');
    
    this.title = this.createElement('h1');
    this.title.textContent = 'Texas Holdem';

    this.form = this.createElement('form');

    this.main = this.createElement('div');
    this.main.className = 'flex-container';
    this.tableTitle = this.createElement('h2');
    this.tableTitle.textContent = 'Table';

    this.canvas = this.createElement('div');
    this.canvas.id = 'canvas';
    this.options = this.createElement('div');
    this.options.id = 'options';
    this.allin = this.createElement('div');
    this.allin.id = 'allinDrop';
    
    this.allin.addEventListener('dragover', event => {

      this.handleDragover(event);
    });

    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Guest';
    this.input.id = 'usernameinput'
    this.input.pattern = "[A-Za-z0-9]+";
    this.input.required = true;
    this.input.title="Username should only contain letters and numbers. e.g. John123";

    this.joinButton = this.createElement('input');
    this.joinButton.id = 'joinButton';
    this.joinButton.type = 'submit'
    this.joinButton.value = 'Join Game'

    this.statisticsButton = this.createElement('button');
    this.statisticsButton.id = 'statisticsButton';
    this.statisticsButton.textContent = 'Statistics'

    this.form.append(this.input, this.joinButton, this.statisticsButton);

    this.app.append(this.title, this.form, this.main);

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
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      handler(this.input.value);
    })
  }

  bindStatistics(handler){
    this.statisticsButton.addEventListener('click', event => {
      event.preventDefault();

      handler();
    })
  }

  bindAction(handler){
    this.options.addEventListener('click', event => {

      handler(event.target.textContent);
    })
  }

  bindDrop(handler){
    this.allin.addEventListener('drop', event => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      handler(event);
    });
  }

  createAllinImg() {
    var allin = this.createElement('img');
    allin.id = 'allin';
    allin.src = 'chips.jpg';
    allin.draggable = 'true';
    
    allin.addEventListener('dragstart', event => {

      this.handleDragStart(event);
    });

    return allin;
  }

  handleDragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

  handleDragover(ev) {
    if (ev.preventDefault) {
      ev.preventDefault();
    }
  }

  displayTable(pokertable) {
    // Todo: Canvas stuff 
    this.removeElement("joinButton")
    this.removeElement("usernameinput")
    this.removeElement("statisticsButton")
    this.main.append(this.tableTitle, this.canvas, this.allin, this.options);
  }

  updateTable(pokertable) {
    // Todo: Canvas stuff 

    
    while(this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
    }
    while(this.options.firstChild) {
      this.options.removeChild(this.options.firstChild);
    }
    while(this.allin.firstChild) {
      this.allin.removeChild(this.allin.firstChild);
    }

    var pot = this.createElement('p');
    pot.textContent = 'Pot: ' + pokertable.pot.toString();

    var flop = this.createElement('p');
    flop.textContent = 'First: ' + pokertable.flop[0].value + ' ' + pokertable.flop[0].suit 
        + ' Second: ' + pokertable.flop[1].value + ' ' + pokertable.flop[1].suit +
      ' Third: ' + pokertable.flop[2].value + ' ' + pokertable.flop[2].suit; 

    var turn = this.createElement('p');
    turn.textContent = 'Turn: ' + pokertable.turn.value + ' ' + pokertable.turn.suit;

    var river = this.createElement('p');
    river.textContent = 'River: ' + pokertable.river.value + ' ' + pokertable.river.suit;

    var players = [];
    var i;

    for(i = 0; i < pokertable.players.length; i++) {
      players.push(this.createElement('p'));
      players[i].textContent = pokertable.players[i].username.toString() + ' Balance: ' + 
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
        if(pokertable.options[j] == "All In") {
          this.options.append(this.createAllinImg());
          continue;
        }
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