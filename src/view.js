class View {
  constructor() {
    this.app = this.getElement('#root');
    
    this.title = this.createElement('h1');
    this.title.textContent = 'Texas Holdem';

    this.joinButton = this.createElement('Button');
    this.joinButton.id = 'joinButton';
    this.joinButton.textContent = 'Join Game';

    this.app.append(this.title, this.joinButton);

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
}


/*<button onclick="c.joinGame()">Join Table</button>
    <div class="header"><h1>Texas Holdem Poker</h1></div>
    <div class="flex-container">
      <div id="canvas"><h2>canvas</h2></div>
      <div id="bottom"><h2>bottom</h2></div>
    </div>*/