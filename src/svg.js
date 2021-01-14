const xmlns = "http://www.w3.org/2000/svg";

const cardHeight = 7,
  cardWidth = 4.8;

const dealerButtonId = "dealerbutton";

function alignSvgObject(object, heightFactor = 1 / 2) {
  var bbox = object.getBBox();
  var width = bbox.width;
  var height = bbox.height;

  object.setAttributeNS(
    null,
    "transform",
    "translate(" + -width / 2 + " " + height * heightFactor + ")"
  );
}

class SvgPlayer {
  constructor(player) {
    if (player) {
      this.id = player.id;
      this.name = player.username;
      this.balance = player.balance;
      this.isactive = player.isactive;
      this.isallin = player.isAllin;
      this.prevaction = player.prevaction;
    }
  }

  appendDetails(parent) {
    if (parent) {
      var textBox, bbox, width, height;

      //BALANCE
      var balanceGroup = document.createElementNS(xmlns, "g");
      var balance = document.createElementNS(xmlns, "text");
      balance.classList.add("text-white");
      var balanceText = document.createTextNode("$ " + this.balance);
      balance.appendChild(balanceText);
      balanceGroup.appendChild(balance);

      parent.appendChild(balanceGroup);

      //background box for Player Balance
      textBox = document.createElementNS(xmlns, "rect");
      textBox.classList.add("fill-red");
      bbox = balanceGroup.getBBox();
      width = bbox.width;
      height = bbox.height;

      let boxHeight = height + 1,
        boxWidth = width + 2;
      textBox.setAttributeNS(null, "width", boxWidth);
      textBox.setAttributeNS(null, "height", boxHeight);
      balanceGroup.appendChild(textBox);

      balanceGroup.removeChild(balance);
      balanceGroup.appendChild(balance); //remove and add again to have it in the foreground
      balance.setAttributeNS(
        null,
        "transform",
        "translate(" +
          (boxWidth / 2 - width / 2) +
          " " +
          (boxHeight / 2 + height / 4) +
          ")"
      );

      alignSvgObject(balanceGroup); //has to be called after the element to align has already been rendered

      //NAME
      var nameGroup = document.createElementNS(xmlns, "g");
      var element = document.createElementNS(xmlns, "text");
      element.classList.add("small");

      var name = "";
      if (this.name.length > 20) {
        name = this.name.slice(0, 20) + "...";
      } else {
        name = this.name;
      }
      var nameNode = document.createTextNode(name);
      element.appendChild(nameNode);
      nameGroup.appendChild(element);

      parent.appendChild(nameGroup);

      //background box for Playername
      var textBox = document.createElementNS(xmlns, "rect");
      textBox.classList.add("fill-white");
      bbox = nameGroup.getBBox();
      width = bbox.width;
      height = bbox.height;

      var addTranslateY = boxHeight;

      (boxHeight = height + 1), (boxWidth = width + 2);
      textBox.setAttributeNS(null, "width", boxWidth);
      textBox.setAttributeNS(null, "height", boxHeight);
      textBox.setAttributeNS(
        null,
        "transform",
        "translate(0 " + addTranslateY + ")"
      );
      nameGroup.appendChild(textBox);

      nameGroup.removeChild(element);
      nameGroup.appendChild(element); //remove and add again to have it in the foreground
      element.setAttributeNS(
        null,
        "transform",
        "translate(" +
          (boxWidth / 2 - width / 2) +
          " " +
          (boxHeight / 2 + height / 4 + addTranslateY) +
          ")"
      );

      alignSvgObject(nameGroup); //has to be called after the element to align has already been rendered

      parent.removeChild(balanceGroup);
      parent.appendChild(balanceGroup);
    }
  }
}

class OtherPlayer extends SvgPlayer {
  constructor(player) {
    console.log("OtherPlayer()");

    super(player);
  }

  appendCardGroup(parentNode) {
    this.cardGroup = document.createElementNS(xmlns, "g");

    var card1 = this.createCard(-15, -cardWidth / 2 - 1.5); // half width of card, -1.5 because cards should be 3 apart
    this.cardGroup.append(card1);

    var card2 = this.createCard(15, -cardWidth / 2 + 1.5); // half width of card, +1.5 because cards should be 3 apart
    this.cardGroup.append(card2);

    parentNode.appendChild(this.cardGroup);

    if (!this.isactive) {
      var foldTextGroup = document.createElementNS(xmlns, "g");
      var foldTextNode = document.createElementNS(xmlns, "text");
      var textContent = "";
      if (this.isallin) {
        textContent = "All In!";
        foldTextNode.setAttributeNS(null, "class", "text-italic");
      } else {
        this.cardGroup.setAttributeNS(null, "opacity", 0.5);
        textContent = "FOLD";
        foldTextNode.setAttributeNS(null, "class", "fill-white");
      }

      var foldTextNodeContent = document.createTextNode(textContent);
      foldTextNode.appendChild(foldTextNodeContent);
      foldTextGroup.appendChild(foldTextNode);
      parentNode.appendChild(foldTextGroup);

      alignSvgObject(foldTextGroup); //align Group before scaling textNode because scaling will be from the center and therefore offset
      foldTextNode.setAttributeNS(
        null,
        "transform",
        "scale(2.4) translate(0 -.8)"
      );
    }
  }

  createCard(rotation = 15, translationX = 0) {
    var height = cardHeight;
    var width = cardWidth;

    var card = document.createElementNS(xmlns, "rect");
    card.setAttributeNS(null, "width", width);
    card.setAttributeNS(null, "height", height);
    card.setAttributeNS(null, "ry", "2%");
    card.setAttributeNS(
      null,
      "transform",
      "translate(" + translationX + " -4) rotate(" + rotation + ")"
    );

    card.setAttributeNS(null, "class", "card");

    return card;
  }
}

class SelfPlayer extends SvgPlayer {
  constructor(player) {
    console.log("SelfPlayer()");

    super(player);

    this.card0 = player.card0;
    this.card1 = player.card1;
  }

  appendCardGroup(parentNode) {
    this.cardGroup = document.createElementNS(xmlns, "g");

    if (this.card0 && this.card1) {
      var card1 = this.createCard(this.card0, -15, -cardWidth / 2 - 1.5); // half width of card, -1.5 because cards should be 3 apart
      this.cardGroup.append(card1);

      var card2 = this.createCard(this.card1, 15, -cardWidth / 2 + 1.5); // half width of card, +1.5 because cards should be 3 apart
      this.cardGroup.append(card2);
    }

    parentNode.appendChild(this.cardGroup);

    if (!this.isactive) {
      var foldTextGroup = document.createElementNS(xmlns, "g");
      var foldTextNode = document.createElementNS(xmlns, "text");
      var textContent = "";
      if (this.isallin) {
        textContent = "All In!";
        foldTextNode.setAttributeNS(null, "class", "text-italic");
      } else {
        this.cardGroup.setAttributeNS(null, "opacity", 0.5);
        textContent = "FOLD";
        foldTextNode.setAttributeNS(null, "class", "fill-white");
      }
      var foldTextNodeContent = document.createTextNode(textContent);
      foldTextNode.appendChild(foldTextNodeContent);
      foldTextGroup.appendChild(foldTextNode);
      parentNode.appendChild(foldTextGroup);

      alignSvgObject(foldTextGroup); //align Group before scaling textNode because scaling will be from the center and therefore offset
      foldTextNode.setAttributeNS(
        null,
        "transform",
        "scale(2.4) translate(0 -.5)"
      );
    }
  }

  createCard(cardObject = this.card0, rotation = 15, translationX = 0) {
    var height = cardHeight;
    var width = cardWidth;

    var cardGroup = document.createElementNS(xmlns, "g");
    cardGroup.setAttributeNS(
      null,
      "transform",
      "translate(" + translationX + " -4) rotate(" + rotation + ")"
    );

    if (cardObject) {
      var card = document.createElementNS(xmlns, "rect");
      card.setAttributeNS(null, "width", width);
      card.setAttributeNS(null, "height", height);
      card.setAttributeNS(null, "ry", "2%");

      card.setAttributeNS(null, "class", "card card-front");
      cardGroup.append(card);

      //SUIT
      var suit = null;
      switch (cardObject.suit) {
        case "c":
          suit = SvgSuit.getSvg(SvgSuit.clubs);
          break;
        case "h":
          suit = SvgSuit.getSvg(SvgSuit.hearts);
          break;
        case "d":
          suit = SvgSuit.getSvg(SvgSuit.diamonds);
          break;
        case "s":
          suit = SvgSuit.getSvg(SvgSuit.spades);
          break;
      }

      if (suit) {
        suit.setAttributeNS(
          null,
          "transform",
          "translate(-1.8 -1.3) scale(0.01)"
        );
        cardGroup.append(suit);
      }

      //VALUE
      if (cardObject.value == "T") {
        cardObject.value = 10;
      }
      var cardValueSvg = document.createElementNS(xmlns, "text");
      var cardValueSvgText = document.createTextNode(cardObject.value);
      cardValueSvg.setAttributeNS(null, "transform", "translate(.6 1.6)");
      cardValueSvg.appendChild(cardValueSvgText);
      cardGroup.appendChild(cardValueSvg);

      if (cardObject.suit == "h" || cardObject.suit == "d") {
        cardValueSvg.setAttributeNS(null, "class", "fill-red");
      }
    }

    return cardGroup;
  }
}

class Svg {
  constructor(parent) {
    this.cardValueNodes = {};

    console.log("SVG()");
    this.svg = document.createElementNS(xmlns, "svg");
    this.svg.id = "svgArea";
    this.svg.setAttribute("viewBox", "0 0 100 50");

    parent.append(this.svg);

    //defs
    var defs = document.createElementNS(xmlns, "defs");
    this.svg.append(defs);

    var filter = document.createElementNS(xmlns, "filter");
    filter.id = "blurFilter";
    var gaussian = document.createElementNS(xmlns, "feGaussianBlur");
    gaussian.setAttributeNS(null, "in", "SourceGraphic");
    gaussian.setAttributeNS(null, "stdDeviation", 0.35);
    filter.appendChild(gaussian);
    defs.appendChild(filter);

    //define Player IsActiveIndicators Positions
    this.playerTopIsActiveIndicator = document.createElementNS(xmlns, "g");
    this.playerTopIsActiveIndicator.id = "playerTopIsActiveIndicator";
    this.playerTopIsActiveIndicator.setAttributeNS(
      null,
      "transform",
      "translate(50 8)"
    );

    this.playerLeftIsActiveIndicator = document.createElementNS(xmlns, "g");
    this.playerLeftIsActiveIndicator.id = "playerLeftIsActiveIndicator";
    this.playerLeftIsActiveIndicator.setAttributeNS(
      null,
      "transform",
      "translate(10 18)"
    );

    this.playerRightIsActiveIndicator = document.createElementNS(xmlns, "g");
    this.playerRightIsActiveIndicator.id = "playerRightIsActiveIndicator";
    this.playerRightIsActiveIndicator.setAttributeNS(
      null,
      "transform",
      "translate(90 18)"
    );

    this.playerSelfIsActiveIndicator = document.createElementNS(xmlns, "g");
    this.playerSelfIsActiveIndicator.id = "playerSelfIsActiveIndicator";
    this.playerSelfIsActiveIndicator.setAttributeNS(
      null,
      "transform",
      "translate(50 43)"
    );

    this.svg.append(
      this.playerTopIsActiveIndicator,
      this.playerLeftIsActiveIndicator,
      this.playerRightIsActiveIndicator,
      this.playerSelfIsActiveIndicator
    );

    //define Player Positions
    this.playerTopGroup = document.createElementNS(xmlns, "g");
    this.playerTopGroup.id = "playerTop";
    this.playerTopGroup.setAttributeNS(null, "transform", "translate(50 5)");

    this.playerLeftGroup = document.createElementNS(xmlns, "g");
    this.playerLeftGroup.id = "playerLeft";
    this.playerLeftGroup.setAttributeNS(null, "transform", "translate(10 15)");

    this.playerRightGroup = document.createElementNS(xmlns, "g");
    this.playerRightGroup.id = "playerRight";
    this.playerRightGroup.setAttributeNS(null, "transform", "translate(90 15)");

    this.playerSelfGroup = document.createElementNS(xmlns, "g");
    this.playerSelfGroup.id = "playerSelf";
    this.playerSelfGroup.setAttributeNS(null, "transform", "translate(50 40)");

    this.svg.append(
      this.playerTopGroup,
      this.playerLeftGroup,
      this.playerRightGroup,
      this.playerSelfGroup
    );

    //define Pot Position
    this.potGroup = document.createElementNS(xmlns, "g");
    this.svg.append(this.potGroup);
    this.potGroup.id = "potGroup";
    this.potGroup.setAttributeNS(null, "transform", "translate(20 30)");

    this.potTitle = document.createElementNS(xmlns, "text");
    var potTitleContent = document.createTextNode("Pot");
    this.potTitle.setAttributeNS(null, "class", "fill-white");
    this.potTitle.appendChild(potTitleContent);
    this.potGroup.appendChild(this.potTitle);

    this.potAmount = document.createElementNS(xmlns, "text");
    this.potAmountContent = document.createTextNode("$ 0");
    this.potAmount.setAttributeNS(null, "class", "fill-white");
    this.potAmount.appendChild(this.potAmountContent);
    this.potGroup.appendChild(this.potAmount);

    this.potDivider = document.createElementNS(xmlns, "rect");
    this.potDivider.setAttributeNS(null, "transform", "translate(0 .7)");
    this.potDivider.setAttributeNS(null, "height", 0.2);
    this.potDivider.setAttributeNS(null, "class", "fill-white");
    this.potGroup.appendChild(this.potDivider);

    //define Board Position
    this.boardGroup = document.createElementNS(xmlns, "g");
    this.svg.append(this.boardGroup);
    this.boardGroup.id = "boardGroup";
    this.boardGroup.setAttributeNS(null, "transform", "translate(50 20)");

    this.bubble = document.createElementNS(xmlns, "symbol");
    this.bubbleId = "bubble";
    this.bubble.id = this.bubbleId;
    var bubblePath = document.createElementNS(xmlns, "path");
    bubblePath.setAttributeNS(
      null,
      "d",
      "M 46.411078,0.36542185 45.987746,0.55703416 36.344149,4.9287701 C 36.184307,4.8274962 36.022704,4.7271974 35.857506,4.6292884 32.062841,2.380237 26.854547,1.003104 21.105842,1.003104 c -5.748711,0 -10.95716,1.377133 -14.7518245,3.6261844 -3.7946718,2.2490536 -6.19842789,5.3980036 -6.19842789,8.9187956 0,3.52079 2.40375609,6.670203 6.19842789,8.919256 3.7946645,2.24905 9.0031135,3.625571 14.7518245,3.625571 5.748705,0 10.956999,-1.376521 14.751664,-3.625571 3.794671,-2.249053 6.198428,-5.398466 6.198428,-8.919256 0,-1.313168 -0.334768,-2.574501 -0.95099,-3.7567936 L 46.060888,0.96883829 Z M 45.027075,1.6169698 40.780263,8.9440177 40.382599,9.782224 c 0.124382,0.218142 0.238766,0.438888 0.341735,0.662114 l 0.0049,0.01644 0.0014,-0.0029 c 0.453895,0.988679 0.695767,2.024797 0.695767,3.090225 0,3.233838 -2.215548,6.199845 -5.889425,8.377303 -3.67387,2.177463 -8.783224,3.538601 -14.431135,3.538601 -5.647905,0 -10.756807,-1.361138 -14.4306763,-3.538601 -3.6738772,-2.177458 -5.89003782,-5.143465 -5.89003782,-8.377303 0,-3.23384 2.21616062,-6.1999965 5.89003782,-8.3774567 3.6738533,-2.1774105 8.7827543,-3.5379361 14.4306593,-3.5379361 5.647911,0 10.757265,1.3605256 14.431135,3.5379836 0.233926,0.1386434 0.459906,0.2814946 0.681784,0.4264034 l 0.691774,-0.2956389 c -0.0014,-0.0011 -0.0027,-0.00215 -0.0049,-0.00328 z"
    );
    var bubbleFill = document.createElementNS(xmlns, "path");
    bubbleFill.setAttributeNS(
      null,
      "d",
      "M 45.552845,1.1952874 36.28103,5.199344 c 0,0 -7.709371,-4.98153015 -17.651104,-3.681343 C 8.6881931,2.8181879 3.6544153,4.2326691 0.47544381,12.76642 -1.7938175,18.858111 12.464619,27.383552 23.152972,25.757751 c 7.313531,-1.112458 8.87776,-0.594904 16.444422,-6.613389 3.650524,-2.903608 1.16596,-9.3644266 1.16596,-9.3644266 z"
    );
    bubbleFill.setAttributeNS(null, "fill", "#fff");

    this.bubble.append(bubbleFill, bubblePath);
    this.svg.append(this.bubble);

    //define Player Notification Positions
    this.playerTopBubbleGroup = document.createElementNS(xmlns, "g");
    this.playerTopBubbleGroup.id = "playerTopBubbleGroup";
    this.playerTopBubbleGroup.setAttributeNS(
      null,
      "transform",
      "translate(55 3)"
    );

    this.playerLeftBubbleGroup = document.createElementNS(xmlns, "g");
    this.playerLeftBubbleGroup.id = "playerLeftBubbleGroup";
    this.playerLeftBubbleGroup.setAttributeNS(
      null,
      "transform",
      "translate(15 8)"
    );

    this.playerRightBubbleGroup = document.createElementNS(xmlns, "g");
    this.playerRightBubbleGroup.id = "playerRightBubbleGroup";
    this.playerRightBubbleGroup.setAttributeNS(
      null,
      "transform",
      "translate(85 22)"
    );

    this.playerSelfBubbleGroup = document.createElementNS(xmlns, "g");
    this.playerSelfBubbleGroup.id = "playerSelfBubbleGroup";
    this.playerSelfBubbleGroup.setAttributeNS(
      null,
      "transform",
      "translate(55 35)"
    );

    this.svg.append(
      this.playerTopBubbleGroup,
      this.playerLeftBubbleGroup,
      this.playerRightBubbleGroup,
      this.playerSelfBubbleGroup
    );
  }

  createCircle(cx = 0, cy = 0, r = 1) {
    var circle = document.createElementNS(xmlns, "circle");
    circle.setAttributeNS(null, "cx", cx);
    circle.setAttributeNS(null, "cy", cy);
    circle.setAttributeNS(null, "r", r);

    return circle;
  }

  createEllipse(cx = 0, cy = 0, rx = 2, ry = 1) {
    var ellipse = document.createElementNS(xmlns, "ellipse");
    ellipse.setAttributeNS(null, "cx", cx);
    ellipse.setAttributeNS(null, "cy", cy);
    ellipse.setAttributeNS(null, "rx", rx);
    ellipse.setAttributeNS(null, "ry", ry);

    return ellipse;
  }

  createTextNode(text) {
    var textNode = document.createElementNS(xmlns, "text");
    var content = document.createTextNode(text);
    textNode.append(content);

    return textNode;
  }

  appendWaitingText(parent) {
    var group = document.createElementNS(xmlns, "g");
    var element = this.createTextNode("Waiting for player");
    element.classList.add("text-white");
    group.append(element);
    parent.append(group);

    var bbox = group.getBBox();
    var width = bbox.width;
    var height = bbox.height;

    var circle = this.createCircle(width / 2, height + 0.25, 0.75); //horizontally center to text element
    circle.classList.add("pulse");
    group.append(circle);

    alignSvgObject(group);
  }

  resetTable() {
    while (this.playerLeftGroup.firstChild) {
      //reset SVG Area
      this.playerLeftGroup.removeChild(this.playerLeftGroup.firstChild);
    }

    while (this.playerRightGroup.firstChild) {
      //reset SVG Area
      this.playerRightGroup.removeChild(this.playerRightGroup.firstChild);
    }

    while (this.playerTopGroup.firstChild) {
      //reset SVG Area
      this.playerTopGroup.removeChild(this.playerTopGroup.firstChild);
    }

    while (this.playerSelfGroup.firstChild) {
      //reset SVG Area
      this.playerSelfGroup.removeChild(this.playerSelfGroup.firstChild);
    }
  }

  startNotification(notification, parentNode, rotation = 0) {
    console.log("Start Bubble: " + notification);
    var bubbleGroup = document.createElementNS(xmlns, "g"); //make group to apply rotation
    bubbleGroup.setAttributeNS(null, "transform", "rotate(" + rotation + ")");
    var bubble = document.createElementNS(xmlns, "use");
    bubble.setAttributeNS(null, "href", "#" + this.bubbleId);
    bubble.setAttributeNS(null, "transform", "scale(0.25)"); //scale inner object, because it's easiest if rotation has center anchor and scaling top left
    bubbleGroup.append(bubble);

    var textNode = this.createTextNode(notification);
    textNode.setAttributeNS(null, "class", "small");
    textNode.setAttributeNS(null, "transform", "translate(3.5 3.5)");

    parentNode.append(bubbleGroup, textNode);

    var textNodeBBox = textNode.getBBox();
    var bubbleBBox = bubbleGroup.getBBox();
    textNode.setAttributeNS(
      null,
      "transform",
      "translate(" +
        (bubbleBBox.width / 2 - textNodeBBox.width / 2) +
        " " +
        bubbleBBox.height / 2 +
        ")"
    );

    //fade in after the node has been set up
    parentNode.setAttributeNS(null, "class", "fadein");

    setTimeout(function () {
      parentNode.setAttributeNS(null, "class", "fadeout");

      setTimeout(function () {
        // after 3s the objects have surely faded out already
        parentNode.removeChild(bubbleGroup);
        parentNode.removeChild(textNode);
      }, 3000);
    }, 7000);
  }

  drawTable(pokertable) {
    console.log("SVG.drawTable()");
    console.log("pokertable: ", pokertable);

    this.resetTable();

    var ownPlayerID = pokertable.playerId;
    var players = []; //just to be sure that array index correlates to player's id
    for (let player of pokertable.players) {
      players[player.id] = player;
    }

    /*
     * Handle Own (Bottom) Player *
     **/
    var ownPlayer = players[ownPlayerID];
    if (ownPlayer) {
      var p = new SelfPlayer(ownPlayer);
      this.dealCards(p, pokertable, this.playerSelfGroup);
      p.appendDetails(this.playerSelfGroup);

      this.indicateIsActive(
        ownPlayerID,
        pokertable,
        this.playerSelfIsActiveIndicator
      );
    } else {
      //if player isn't in current players array
      this.checkPlayerSelfLost(pokertable);
    }

    if (ownPlayerID == pokertable.dealerId) {
      this.appendDealerButton(this.playerSelfGroup);
    } else {
      this.checkBlinds(pokertable, ownPlayer, this.playerSelfBubbleGroup, 180);
    }

    /*
     * LEFT PLAYER *
     ***/
    var otherPlayerId = (ownPlayerID + 1) % 4;
    var otherPlayer = players[otherPlayerId];
    if (otherPlayer) {
      var p = new OtherPlayer(otherPlayer);
      this.dealCards(p, pokertable, this.playerLeftGroup);
      p.appendDetails(this.playerLeftGroup);

      this.indicateIsActive(
        otherPlayerId,
        pokertable,
        this.playerLeftIsActiveIndicator
      );
    } else {
      this.handleOtherPlayerLostOrWaiting(
        otherPlayerId,
        pokertable,
        this.playerLeftGroup
      );
    }

    if (otherPlayerId == pokertable.dealerId) {
      this.appendDealerButton(this.playerLeftGroup);
    } else {
      this.checkBlinds(
        pokertable,
        otherPlayer,
        this.playerLeftBubbleGroup,
        180
      );
    }

    /*
     * TOP PLAYER *
     ***/
    otherPlayerId = (ownPlayerID + 2) % 4;
    otherPlayer = players[otherPlayerId];
    if (otherPlayer) {
      var p = new OtherPlayer(otherPlayer);
      this.dealCards(p, pokertable, this.playerTopGroup);
      p.appendDetails(this.playerTopGroup);

      this.indicateIsActive(
        otherPlayerId,
        pokertable,
        this.playerTopIsActiveIndicator
      );
    } else {
      this.handleOtherPlayerLostOrWaiting(
        otherPlayerId,
        pokertable,
        this.playerTopGroup
      );
    }

    if (otherPlayerId == pokertable.dealerId) {
      this.appendDealerButton(this.playerTopGroup);
    } else {
      this.checkBlinds(pokertable, otherPlayer, this.playerTopBubbleGroup, 180);
    }

    /*
     * RIGHT PLAYER *
     ***/
    otherPlayerId = (ownPlayerID + 3) % 4;
    otherPlayer = players[otherPlayerId];
    if (otherPlayer) {
      var p = new OtherPlayer(otherPlayer);
      this.dealCards(p, pokertable, this.playerRightGroup);
      p.appendDetails(this.playerRightGroup);

      this.indicateIsActive(
        otherPlayerId,
        pokertable,
        this.playerRightIsActiveIndicator
      );
    } else {
      this.handleOtherPlayerLostOrWaiting(
        otherPlayerId,
        pokertable,
        this.playerRightGroup
      );
    }

    if (otherPlayerId == pokertable.dealerId) {
      this.appendDealerButton(this.playerRightGroup);
    } else {
      this.checkBlinds(pokertable, otherPlayer, this.playerRightBubbleGroup);
    }

    this.updatePot(pokertable.pot);
  }

  updatePot(potValue) {
    this.potAmountContent.nodeValue = "$ " + potValue;
  }

  setPotTranslations() {
    //this is called in view.displayTable() after svg has been appended, so that BBox can be calculated
    console.log("Svg.setPotTranslations()");
    var potTitleBBox = this.potTitle.getBBox();
    var potTitleWidth = potTitleBBox.width,
      potTitleHeight = potTitleBBox.height;
    this.potAmount.setAttributeNS(
      null,
      "transform",
      "translate(0 " + potTitleHeight * 1.5 + ")"
    );

    this.potDivider.setAttributeNS(null, "width", potTitleWidth + 2);
  }

  updateBoard(flop, turn, river) {
    console.log("SVG.updateBoard()");

    //reset Board
    while (this.boardGroup.firstChild) {
      this.boardGroup.removeChild(this.boardGroup.firstChild);
    }
    this.cardValueNodes = []; //reset the value nodes that can be copied once created

    let i = flop.length - 1;
    for (let card of flop) {
      var cardNode = this.getBoardCardNode(card);
      cardNode.setAttributeNS(
        null,
        "transform",
        "translate(" + (-cardWidth - 1.5) * i + ")"
      );
      i--;
      this.boardGroup.appendChild(cardNode);
    }

    var turnNode = this.getBoardCardNode(turn);
    turnNode.setAttributeNS(
      null,
      "transform",
      "translate(" + (cardWidth + 1.5) * 1 + ")"
    );
    this.boardGroup.appendChild(turnNode);

    var riverNode = this.getBoardCardNode(river);
    riverNode.setAttributeNS(
      null,
      "transform",
      "translate(" + (cardWidth + 1.5) * 2 + ")"
    );
    this.boardGroup.appendChild(riverNode);
  }

  getBoardCardNode(card = null) {
    var height = cardHeight;
    var width = cardWidth;

    var cardGroup = document.createElementNS(xmlns, "g");

    if (card) {
      var cardRect = document.createElementNS(xmlns, "rect");
      cardRect.setAttributeNS(null, "width", width);
      cardRect.setAttributeNS(null, "height", height);
      cardRect.setAttributeNS(null, "ry", "2%");

      cardRect.setAttributeNS(null, "class", "card card-front");
      cardGroup.append(cardRect);

      //SUIT
      var suit = null;
      switch (card.suit) {
        case "c":
          suit = SvgSuit.getSvg(SvgSuit.clubs);
          break;
        case "h":
          suit = SvgSuit.getSvg(SvgSuit.hearts);
          break;
        case "d":
          suit = SvgSuit.getSvg(SvgSuit.diamonds);
          break;
        case "s":
          suit = SvgSuit.getSvg(SvgSuit.spades);
          break;
      }

      if (suit) {
        suit.setAttributeNS(
          null,
          "transform",
          "translate(-1.8 -1.3) scale(0.01)"
        );
        cardGroup.append(suit);
      }

      //VALUE
      if (card.value == "T") {
        card.value = 10;
      }
      var cardValueSvg = null,
        cardValueSvgReverse = null;
      var coloredValue = "Black" + card.value;
      if (card.suit == "h" || card.suit == "d") {
        coloredValue = "Red" + card.value;
      }
      if (this.cardValueNodes.hasOwnProperty(coloredValue)) {
        //the needed Node already exists
        cardValueSvg = document.createElementNS(xmlns, "use");
        cardValueSvg.setAttributeNS(null, "href", "#cardValue" + coloredValue);
        cardGroup.appendChild(cardValueSvg);
      } else {
        cardValueSvg = this.createTextNode(card.value);
        cardValueSvg.id = "cardValue" + coloredValue;
        cardValueSvg.setAttributeNS(null, "transform", "translate(.6 1.6)");
        cardGroup.appendChild(cardValueSvg);

        this.cardValueNodes[coloredValue] = cardValueSvg;
      }

      //VALUE UPSIDE DOWN
      if (this.cardValueNodes.hasOwnProperty(coloredValue)) {
        //the needed Node should already exist
        cardValueSvgReverse = document.createElementNS(xmlns, "use");
        cardValueSvgReverse.setAttributeNS(
          null,
          "href",
          "#cardValue" + coloredValue
        );
        cardValueSvgReverse.setAttributeNS(
          null,
          "transform",
          "translate(" + cardWidth + " " + cardHeight + ") rotate(180)  "
        );
        cardGroup.appendChild(cardValueSvgReverse);
      }

      /* Hint on working with 'use':
       *  Pay attention to fill-color of object that ought to be used.
       */
      if (card.suit == "h" || card.suit == "d") {
        cardValueSvg.setAttributeNS(null, "class", "fill-red");
        cardValueSvgReverse.setAttributeNS(null, "class", "fill-red");
      }
    }

    return cardGroup;
  }

  getOtherPlayerLostText(player) {
    var oopsTextNode = this.createTextNode(
      player.username + " lost all their money!"
    );
    oopsTextNode.setAttributeNS(null, "class", "fill-white");

    return oopsTextNode;
  }

  handleOtherPlayerLostOrWaiting(playerId, pokertable, parentNode) {
    var playerLost = null;
    for (let player of pokertable.playersLost) {
      if (player.id == playerId) {
        playerLost = player;
      }
    }

    if (playerLost) {
      var playerLostText = this.getOtherPlayerLostText(playerLost);
      parentNode.append(playerLostText);
      alignSvgObject(playerLostText);
    } else {
      this.appendWaitingText(parentNode);
    }
  }

  appendDealerButton(parentNode) {
    var buttonGroup = document.createElementNS(xmlns, "g");
    buttonGroup.setAttributeNS(
      null,
      "transform",
      "scale(0.4) translate(-18 2)"
    );
    var buttonCircle = this.createCircle();
    buttonCircle.setAttributeNS(null, "class", "dealerbutton");
    buttonCircle.setAttributeNS(null, "transform", "scale(4)");

    var buttonTextNode = this.createTextNode("DEALER");
    buttonTextNode.setAttributeNS(null, "class", "text-sans");

    buttonGroup.append(buttonCircle, buttonTextNode);
    buttonGroup.id = dealerButtonId;
    parentNode.append(buttonGroup);

    alignSvgObject(buttonTextNode, 1 / 4);
  }

  checkPlayerSelfLost(pokertable) {
    for (let playerLost of pokertable.playersLost) {
      if (playerLost.id == pokertable.playerId) {
        var oopsGroup = document.createElementNS(xmlns, "g");
        var oopsTextNode = this.createTextNode("Woah,");
        oopsTextNode.setAttributeNS(null, "class", "fill-white");
        oopsTextNode.setAttributeNS(null, "transform", "scale(1.8)");

        oopsGroup.appendChild(oopsTextNode);
        this.playerSelfGroup.appendChild(oopsGroup);
        alignSvgObject(oopsGroup);

        var youLostGroup = document.createElementNS(xmlns, "g");
        var youLostTextNode = this.createTextNode(
          "You've lost all your money, Cowboy!"
        );
        youLostTextNode.setAttributeNS(null, "class", "fill-white");
        youLostGroup.appendChild(youLostTextNode);
        this.playerSelfGroup.appendChild(youLostGroup);
        alignSvgObject(youLostTextNode);

        var oopsGroupBBox = oopsGroup.getBBox();
        var oopsGroupHeight = oopsGroupBBox.height;
        youLostGroup.setAttributeNS(
          null,
          "transform",
          "translate( 0 " + oopsGroupHeight + ")"
        );
      }
    }
  }

  checkBlinds(pokertable, player, notificationGroupNode, bubbleRotation) {
    var smallBlindId = (pokertable.dealerId + 1) % 4;
    var bigBlindId = (pokertable.dealerId + 2) % 4;

    if (player && pokertable.lastAction == "New Round") {
      if (player.id == smallBlindId) {
        this.startNotification(
          "Small blind $ " + player.bet,
          notificationGroupNode,
          bubbleRotation
        );
      } else if (player.id == bigBlindId) {
        this.startNotification(
          "Big blind $ " + player.bet,
          notificationGroupNode,
          bubbleRotation
        );
      }
    }
  }

  dealCards(svgPlayer, pokertable, playerGroupNode) {
    if (pokertable.lastAction) {
      //if New Round, delay Display of Cards until Blinds have been set
      if (pokertable.lastAction == "New Round") {
        var position = svgPlayer.id - pokertable.dealerId; //this is the formula to determine at what position the player get's his cards dealt
        if (svgPlayer.id <= pokertable.dealerId) {
          position = 4 + position;
        }
        setTimeout(
          function (parent, p) {
            var dealerButton = null;
            while (parent.firstChild) {
              if (parent.firstChild.id == dealerButtonId) {
                dealerButton = parent.firstChild;
              }
              parent.removeChild(parent.firstChild);
            }
            p.appendCardGroup(parent);
            p.appendDetails(parent);
            if (dealerButton) {
              parent.appendChild(dealerButton);
            }
          },
          2000 + 1000 * (position - 1),
          playerGroupNode,
          svgPlayer
        );
      } else {
        svgPlayer.appendCardGroup(playerGroupNode);
      }
    }
  }

  indicateIsActive(playerId, pokertable, parentNode) {
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }

    if (playerId == pokertable.activePlayer) {
      var activeIndicator = this.createEllipse(0, 0, 8, 2.5);
      activeIndicator.setAttributeNS(null, "filter", "url(#blurFilter)");
      activeIndicator.setAttributeNS(null, "fill", "#12de12");
      activeIndicator.setAttributeNS(null, "opacity", 0.5);
      activeIndicator.setAttributeNS(null, "class", "scale-pulse");

      parentNode.append(activeIndicator);
    }
  }

  showLastAction(pokertable) {
    var lastPlayer = null;
    for (let player of pokertable.players) {
      if (pokertable.lastAction.player == player.id) {
        lastPlayer = player;
      }
    }

    if (lastPlayer) {
      var lastActionString = pokertable.lastAction.action;

      var parentNode = null;
      var bubbleRotation = 180;
      switch (lastPlayer.id) {
        case pokertable.playerId:
          parentNode = this.playerSelfBubbleGroup;
          break;
        case (pokertable.playerId + 1) % 4:
          parentNode = this.playerLeftBubbleGroup;
          break;
        case (pokertable.playerId + 2) % 4:
          parentNode = this.playerTopBubbleGroup;
          break;
        case (pokertable.playerId + 3) % 4:
          parentNode = this.playerRightBubbleGroup;
          bubbleRotation = 0;
          break;
      }

      if (parentNode) {
        this.startNotification(lastActionString, parentNode, bubbleRotation);
      }
    }
  }
}
