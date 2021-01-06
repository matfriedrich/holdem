class View {
  /**
   * Creates a new View
   */
  constructor() {
    this.app = this.getElement("#root")

    this.title = this.createElement("h1")
    this.title.textContent = "Texas Holdem"
    this.title.classList.add("text-center")

    this.form = this.createElement("form")
    this.form.classList.add("text-center")

    this.main = this.createElement("div")
    this.main.className = "flex-container"

    this.canvas = this.createElement("div")
    this.canvas.id = "canvas"
    this.svgBox = this.createElement("div")
    this.svgBox.id = "svgBox"
    this.svg = new Svg(this.svgBox)
    this.options = this.createElement("div")
    this.options.id = "options"

    this.svgBox.addEventListener("dragover", (event) => {
      this.handleDragover(event)
    })

    this.input = this.createElement("input")
    this.input.type = "text"
    this.input.setAttribute("autofocus", true)
    this.input.placeholder = "Guest"
    this.input.id = "usernameinput"
    this.input.pattern = "[A-Za-z0-9]+"
    this.input.required = true
    this.input.title =
      "Username should only contain letters and numbers. e.g. John123"

    this.joinButton = this.createElement("input")
    this.joinButton.id = "joinButton"
    this.joinButton.classList.add("btn")
    this.joinButton.type = "submit"
    this.joinButton.value = "Join Game"

    this.statisticsButton = this.createElement("button")
    this.statisticsButton.id = "statisticsButton"
    this.statisticsButton.classList.add("btn")
    this.statisticsButton.textContent = "Statistics"

    this.form.append(this.input, this.joinButton, this.statisticsButton)

    this.app.append(this.title, this.form, this.main)
  }

  /**
   * Create an element with an optional CSS class
   * @param {*} tag Type of element to create
   * @param {*} className Name of CSS class
   * @return {*} element that was created
   */
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) {
      element.classList.add(className)
    }

    return element
  }

  /**
   * Retrive an element from the DOM
   * @param {*} selector Identifier of the element
   * @return {*} element
   */
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  /**
   * Delete an element from the DOM
   * @param {*} id Identifier of the element
   */
  removeElement(id) {
    var element = document.getElementById(id)
    if (element !== null) {
      element.parentNode.removeChild(element)
    }
  }

  /**
   * Bind join button eventlistener to handler function from the controller
   * @param {*} handler Handler function of the controller
   */
  bindJoin(handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault()

      handler(this.input.value)
    })
  }

  /**
   * Bind statistics button eventlistener to handler function from the controller
   * @param {*} handler Handler function of the controller
   */
  bindStatistics(handler) {
    this.statisticsButton.addEventListener("click", (event) => {
      event.preventDefault()

      handler()
    })
  }

  /**
   * Bind action button eventlistener to handler function from the controller
   * @param {*} handler Handler function of the controller
   */
  bindAction(handler) {
    this.options.addEventListener("click", (event) => {
      handler(event.target.textContent)
    })
  }

  /**
   * Bind drag and drop eventlistener to handler function from the controller
   * @param {*} handler Handler function of the controller
   */
  bindDrop(handler) {
    this.svgBox.addEventListener("drop", (event) => {
      if (event.preventDefault) {
        event.preventDefault()
      }
      handler(event)
    })
  }

  /**
   * Create the img element for the all in functionality
   * @return {*} element that was created
   */
  createAllinImg() {
    var allin = this.createElement("img")
    allin.id = "allin"
    allin.src = "chips.png"
    allin.draggable = "true"
    allin.style.width = "20%"

    allin.addEventListener("dragstart", (event) => {
      this.handleDragStart(event)
    })

    return allin
  }

  /**
   * Set behaviour when all in img gets dragged
   * @param {*} ev Event
   */
  handleDragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id)
  }

  /**
   * Set behaviour while all in img is being dragged
   * @param {*} ev Event
   */
  handleDragover(ev) {
    if (ev.preventDefault) {
      ev.preventDefault()
    }
  }

  /**
   * Display the table to clients
   * @param {PokerTable} pokertable The pokertable to draw
   */
  displayTable(pokertable) {
    console.log("View. displayTable()")

    // Todo: Canvas stuff
    this.removeElement("joinButton")
    this.removeElement("usernameinput")
    this.removeElement("statisticsButton")
    this.main.append(this.canvas, this.svgBox, this.options)

    this.svg.setPotTranslations() //called after appending this.svgBox so that the translations can be calculated

    this.svg.drawTable(pokertable)
  }

  updatePlayers(pokertable) {
    console.log("View.updatePlayers()")

    this.svg.drawTable(pokertable)
  }

  updateBoard(flop, turn, river) {
    console.log("View.updateBoard()")

    this.svg.updateBoard(flop, turn, river)
  }

  updateTable(pokertable) {
    console.log("View. updateTable()")

    // Todo: Canvas stuff
    this.svg.drawTable(pokertable)

    while (this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild)
    }
    while (this.options.firstChild) {
      this.options.removeChild(this.options.firstChild)
    }

    var pot = this.createElement("p")
    pot.textContent = "Pot: " + pokertable.pot.toString()

    var flop = this.createElement("p")
    flop.textContent =
      "First: " +
      pokertable.flop[0].value +
      " " +
      pokertable.flop[0].suit +
      " Second: " +
      pokertable.flop[1].value +
      " " +
      pokertable.flop[1].suit +
      " Third: " +
      pokertable.flop[2].value +
      " " +
      pokertable.flop[2].suit

    var turn = this.createElement("p")
    turn.textContent =
      "Turn: " + pokertable.turn.value + " " + pokertable.turn.suit

    var river = this.createElement("p")
    river.textContent =
      "River: " + pokertable.river.value + " " + pokertable.river.suit

    var players = []
    var i

    for (i = 0; i < pokertable.players.length; i++) {
      players.push(this.createElement("p"))
      players[i].textContent =
        pokertable.players[i].username.toString() +
        " Balance: " +
        pokertable.players[i].balance.toString() +
        " Card0: " +
        pokertable.players[i].card0.value +
        " " +
        pokertable.players[i].card0.suit +
        " Card1: " +
        pokertable.players[i].card1.value +
        " " +
        pokertable.players[i].card1.suit +
        " Bet: " +
        pokertable.players[i].bet
    }

    var lastaction = this.createElement("p")
    lastaction.textContent = pokertable.lastAction

    var result = this.createElement("p")
    result.textContent = pokertable.result

    this.canvas.append(
      pot,
      flop,
      turn,
      river,
      players[0],
      players[1],
      players[2],
      players[3],
      lastaction,
      result
    )

    var j

    if (pokertable.isActivePlayer) {
      for (j = 0; j < pokertable.options.length; j++) {
        if (pokertable.options[j] == "All In") {
          this.options.append(this.createAllinImg())
          continue
        }
        var button = this.createElement("button")
        button.textContent = pokertable.options[j]
        this.options.append(button)
      }
    }

  }
}
