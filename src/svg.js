const xmlns = "http://www.w3.org/2000/svg";

const cardHeight = 7, cardWidth = 4.8;

function  alignSvgObject(object) {
    var bbox = object.getBBox();
    var width = bbox.width;
    var height = bbox.height;

    object.setAttributeNS(null, 'transform', 'translate('+ -width/2 +' '+ height/2 +')' );
}

class SvgPlayer {
    constructor(name = "Unknown Player", balance = 0) {
        this.name = name
        this.balance = balance
    }

    appendDetails(parent) {
        if(parent) {
            var textBox, bbox, width, height;


            //BALANCE
            var balanceGroup = document.createElementNS(xmlns, 'g');
            var balance = document.createElementNS(xmlns, 'text');
            balance.classList.add("text-white");
            var balanceText = document.createTextNode( "$ " + this.balance );
            balance.appendChild(balanceText);
            balanceGroup.appendChild(balance);

            parent.appendChild(balanceGroup);


            //background box for Player Balance
            textBox = document.createElementNS(xmlns, 'rect');
            textBox.classList.add("fill-red");
            bbox = balanceGroup.getBBox();
            width = bbox.width;
            height = bbox.height;

            let boxHeight = height + 1, boxWidth = width + 2;
            textBox.setAttributeNS(null, 'width', boxWidth);
            textBox.setAttributeNS(null, 'height', boxHeight);
            balanceGroup.appendChild(textBox);

            balanceGroup.removeChild(balance);
            balanceGroup.appendChild(balance); //remove and add again to have it in the foreground
            balance.setAttributeNS(null, 'transform', 'translate('+ ( boxWidth/2 - width/2 ) + ' ' + (boxHeight/2 + height/4) +')' );

            alignSvgObject(balanceGroup);   //has to be called after the element to align has already been rendered


            //NAME
            var nameGroup = document.createElementNS(xmlns, 'g');
            var element = document.createElementNS(xmlns, 'text');
            element.classList.add("small");

            var name = '';
            if(this.name.length > 20) {
                name = this.name.slice(0, 20) + "..." ;
            } else {
                name = this.name;
            }
            var nameNode = document.createTextNode( name );
            element.appendChild(nameNode);
            nameGroup.appendChild(element);

            parent.appendChild(nameGroup);


            //background box for Playername
            var textBox = document.createElementNS(xmlns, 'rect');
            textBox.classList.add("fill-white");
            bbox = nameGroup.getBBox();
            width = bbox.width;
            height = bbox.height;

            var addTranslateY = boxHeight;

            boxHeight = height + 1, boxWidth = width + 2;
            textBox.setAttributeNS(null, 'width', boxWidth);
            textBox.setAttributeNS(null, 'height', boxHeight);
            textBox.setAttributeNS(null, 'transform', 'translate(0 '+ ( addTranslateY) +')' );
            nameGroup.appendChild(textBox);

            nameGroup.removeChild(element);
            nameGroup.appendChild(element); //remove and add again to have it in the foreground
            element.setAttributeNS(null, 'transform', 'translate('+ ( boxWidth/2 - width/2 ) + ' ' + (boxHeight/2 + height/4 + addTranslateY) +')' );

            alignSvgObject(nameGroup);   //has to be called after the element to align has already been rendered


            parent.removeChild(balanceGroup);
            parent.appendChild(balanceGroup);
        }
    }
}

class OtherPlayer extends SvgPlayer {

    constructor(name, balance){
        console.log("OtherPlayer()");

        super(name, balance);
    }

    getCardGroup() {
        this.cardGroup = document.createElementNS(xmlns, "g");

        var card1 = this.createCard(-15, -3.5); // -2 because half width of card, -1.5 because cards should be 3 apart
        this.cardGroup.append(card1);

        var card2 = this.createCard(15, -0.5);  // -2 because half width of card, +1.5 because cards should be 3 apart
        this.cardGroup.append(card2);

        return this.cardGroup;
    }

    createCard(rotation = 15, translationX = 0) {
        var  height = cardHeight;
        var width = cardWidth;

        var card = document.createElementNS(xmlns, "rect");
        card.setAttributeNS(null, 'width', width);
        card.setAttributeNS(null, 'height', height);
        card.setAttributeNS(null, 'ry', '2%');
        card.setAttributeNS(null, 'transform', 'translate('+ translationX +' -4) rotate('+rotation+ ')');

        card.setAttributeNS(null, 'class', 'card');

        return card;
    }
}

class SelfPlayer extends SvgPlayer {

    constructor(name, balance, card0 = null, card1 = null){
        console.log("SelfPlayer()");

        super(name, balance);

        this.card0 = card0;
        this.card1 = card1;
    }

    getCardGroup() {
        this.cardGroup = document.createElementNS(xmlns, "g");

        var card1 = this.createCard(this.card0, -15, -3.5); // -2 because half width of card, -1.5 because cards should be 3 apart
        this.cardGroup.append(card1);

        var card2 = this.createCard(this.card1, 15, -0.5);  // -2 because half width of card, +1.5 because cards should be 3 apart
        this.cardGroup.append(card2);

        return this.cardGroup;
    }

    createCard(cardObject = this.card0, rotation = 15, translationX = 0) {
        var  height = cardHeight;
        var width = cardWidth;

        var cardGroup = document.createElementNS(xmlns, "g");
        cardGroup.setAttributeNS(null, 'transform', 'translate('+ translationX +' -4) rotate('+rotation+ ')');


        if(cardObject) {
            var card = document.createElementNS(xmlns, "rect");
            card.setAttributeNS(null, 'width', width);
            card.setAttributeNS(null, 'height', height);
            card.setAttributeNS(null, 'ry', '2%');

            card.setAttributeNS(null, 'class', 'card card-front');
            cardGroup.append(card);

            //SUIT
            var suit = null;
            switch(cardObject.suit) {
                case 'c':   suit = SvgSuit.getSvg(SvgSuit.clubs);
                            break;
                case 'h':   suit = SvgSuit.getSvg(SvgSuit.hearts);
                            break;
                case 'd':   suit = SvgSuit.getSvg(SvgSuit.diamonds);
                            break;
                case 's':   suit = SvgSuit.getSvg(SvgSuit.spades);
                            break;
            }

            if(suit) {
                suit.setAttributeNS(null, 'transform', 'translate(-1.8 -1.3) scale(0.01)');
                cardGroup.append(suit);
            }

            //VALUE
            var cardValueSvg = document.createElementNS(xmlns, 'text');
            var cardValueSvgText = document.createTextNode( cardObject.value );
            cardValueSvg.setAttributeNS(null, 'transform', 'translate(.6 1.6)');
            cardValueSvg.appendChild(cardValueSvgText);
            cardGroup.appendChild(cardValueSvg);

            if(cardObject.suit == 'h'|| cardObject.suit == 'd') {
                cardValueSvg.setAttributeNS(null, "class", 'fill-red');
            }
        }

        return cardGroup;
    }
}

class Svg {

    constructor(parent){

      this.cardValueNodes = {};
      this.flopNodes = [];
      this.riverNode
      this.turnNode

      console.log("SVG");
      this.svg = document.createElementNS(xmlns, "svg");
      this.svg.id = "svgArea";
      this.svg.setAttribute("viewBox", "0 0 100 50"); 

      parent.append(this.svg);

      //define Player Positions
      this.playerTopGroup = document.createElementNS(xmlns, "g");
      this.playerTopGroup.id = "playerTop";
      this.playerTopGroup.setAttributeNS(null, 'transform', 'translate(50 5)');

      this.playerLeftGroup = document.createElementNS(xmlns, "g");
      this.playerLeftGroup.id = "playerLeft";
      this.playerLeftGroup.setAttributeNS(null, 'transform', 'translate(10 15)');

      this.playerRightGroup = document.createElementNS(xmlns, "g");
      this.playerRightGroup.id = "playerRight";
      this.playerRightGroup.setAttributeNS(null, 'transform', 'translate(90 15)');

      this.playerSelfGroup = document.createElementNS(xmlns, "g");
      this.playerSelfGroup.id = "playerSelf";
      this.playerSelfGroup.setAttributeNS(null, 'transform', 'translate(50 40)');

      this.svg.append(this.playerTopGroup, this.playerLeftGroup, this.playerRightGroup, this.playerSelfGroup);

      //define Pot Position
      this.potGroup = document.createElementNS(xmlns, "g");
      this.svg.append(this.potGroup);
      this.potGroup.id = "potGroup";
      this.potGroup.setAttributeNS(null, 'transform', 'translate(20 30)');

      this.potTitle = document.createElementNS(xmlns, "text");
      var potTitleContent = document.createTextNode( "Pot" );
      this.potTitle.setAttributeNS(null, 'class', 'fill-white');
      this.potTitle.appendChild(potTitleContent);
      this.potGroup.appendChild(this.potTitle);

      this.potAmount = document.createElementNS(xmlns, "text");
      this.potAmountContent = document.createTextNode( "$ 0" );
      this.potAmount.setAttributeNS(null, 'class', 'fill-white');
      this.potAmount.appendChild(this.potAmountContent);
      this.potGroup.appendChild(this.potAmount);

      this.potDivider = document.createElementNS(xmlns, "rect");
      this.potDivider.setAttributeNS(null, 'transform', 'translate(0 .7)');
      this.potDivider.setAttributeNS(null, 'height', .2);
      this.potDivider.setAttributeNS(null, 'class', 'fill-white');
      this.potGroup.appendChild(this.potDivider);

      //define Board Position
      this.boardGroup = document.createElementNS(xmlns, "g");
      this.svg.append(this.boardGroup);
      this.boardGroup.id = "boardGroup";
      this.boardGroup.setAttributeNS(null, 'transform', 'translate(50 20)');
    }

    createCircle(cx = 0, cy = 0, r = 1) {
        var circle = document.createElementNS(xmlns, "circle");
        circle.setAttributeNS(null, 'cx', cx);
        circle.setAttributeNS(null, 'cy', cy);
        circle.setAttributeNS(null, 'r', r);

        return circle;
    }

    appendWaitingText(parent) {
        var group = document.createElementNS(xmlns, 'g');
        var element = document.createElementNS(xmlns, 'text');
        element.classList.add("text-white");
        var nameNode = document.createTextNode("Waiting for player");
        element.appendChild(nameNode);
        group.append(element);
        parent.append(group);

        var bbox = group.getBBox();
        var width = bbox.width;
        var height = bbox.height;

        var circle = this.createCircle(width/2, height + 0.25, 0.75) //horizontally center to text element
        circle.classList.add("pulse");
        group.append(circle);

        alignSvgObject(group);

    }

    resetTable() {
        while(this.playerLeftGroup.firstChild) {    //reset SVG Area
            this.playerLeftGroup.removeChild(this.playerLeftGroup.firstChild);
        }

        while(this.playerRightGroup.firstChild) {    //reset SVG Area
            this.playerRightGroup.removeChild(this.playerRightGroup.firstChild);
        }

        while(this.playerTopGroup.firstChild) {    //reset SVG Area
            this.playerTopGroup.removeChild(this.playerTopGroup.firstChild);
        }

        while(this.playerSelfGroup.firstChild) {    //reset SVG Area
            this.playerSelfGroup.removeChild(this.playerSelfGroup.firstChild);
        }
    }

    drawTable(pokertable) {
        console.log("SVG.drawTable()");
        console.log("pokertable: ", pokertable)

        this.resetTable();

        var ownPlayerID = pokertable.playerId;
        var players = [];   //just to be sure that array index correlates to player's id
        for(let player of pokertable.players) {
            players[player.id] = player;
        }


        var ownPlayer = players[ownPlayerID];
        if(ownPlayer) {
            var p = new SelfPlayer(ownPlayer.username, ownPlayer.balance, ownPlayer.card0, ownPlayer.card1);
            if(ownPlayer.card0 && ownPlayer.card1) {
                this.playerSelfGroup.append(p.getCardGroup());
            }
            p.appendDetails(this.playerSelfGroup);
        }


        var otherPlayer = players[ (ownPlayerID + 1) % 4 ];
        if( otherPlayer ) {    //left player
            var p = new OtherPlayer(otherPlayer.username, otherPlayer.balance);
            if(otherPlayer.card0 && otherPlayer.card1) {
                this.playerLeftGroup.append(p.getCardGroup());
            }
            p.appendDetails(this.playerLeftGroup);
        } else {
            this.appendWaitingText(this.playerLeftGroup);
        }

        otherPlayer = players[ (ownPlayerID + 2) % 4 ];
        if( otherPlayer ) {    //top player
            var p = new OtherPlayer(otherPlayer.username, otherPlayer.balance);
            if(otherPlayer.card0 && otherPlayer.card1) {
                this.playerTopGroup.append(p.getCardGroup());
            }
            p.appendDetails(this.playerTopGroup);

        } else {
            this.appendWaitingText(this.playerTopGroup);
        }

        otherPlayer = players[ (ownPlayerID + 3) % 4 ];
        if( otherPlayer ) {    //right player
            var p = new OtherPlayer(otherPlayer.username, otherPlayer.balance);
            if(otherPlayer.card0 && otherPlayer.card1) {
                this.playerRightGroup.append(p.getCardGroup());
            }
            p.appendDetails(this.playerRightGroup);

        } else {
            this.appendWaitingText(this.playerRightGroup);
        }




        this.updatePot(pokertable.pot);

    }

    updatePot(potValue) {
        this.potAmountContent.nodeValue = "$ " + potValue;
    }

    setPotTranslations() {  //this is called in view.displayTable() after svg has been appended, so that BBox can be calculated
        console.log("Svg.setPotTranslations()")
        var potTitleBBox = this.potTitle.getBBox();
        var potTitleWidth = potTitleBBox.width, potTitleHeight = potTitleBBox.height;
        this.potAmount.setAttributeNS(null, 'transform', 'translate(0 '+ potTitleHeight * 1.5 +')');

        this.potDivider.setAttributeNS(null, 'width', potTitleWidth +2);
    }

    updateBoard(flop, turn, river) {
        console.log("SVG.updateBoard()")

        while(this.boardGroup.firstChild) {    //reset Board
            this.boardGroup.removeChild(this.boardGroup.firstChild);
        }
        this.cardValueNodes = [];   //reset the value nodes that can be copied once created


        let i = flop.length - 1;
        for( let card of flop) {
            var cardNode = this.getBoardCardNode(card);
            cardNode.setAttributeNS(null, 'transform', 'translate('+ ( (- cardWidth - 1.5) * i ) +')' );
            i--;
            this.boardGroup.appendChild(cardNode);
        }

        var turnNode = this.getBoardCardNode(turn);
        turnNode.setAttributeNS(null, 'transform', 'translate('+ ( ( cardWidth + 1.5) * 1 ) +')' );
        this.boardGroup.appendChild(turnNode);

        var riverNode = this.getBoardCardNode(river);
        riverNode.setAttributeNS(null, 'transform', 'translate('+ ( ( cardWidth + 1.5) * 2 ) +')' );
        this.boardGroup.appendChild(riverNode);
    }

    getBoardCardNode(card = null) {
        var  height = cardHeight;
        var width = cardWidth;

        var cardGroup = document.createElementNS(xmlns, "g");

        if(card) {
            var cardRect = document.createElementNS(xmlns, "rect");
            cardRect.setAttributeNS(null, 'width', width);
            cardRect.setAttributeNS(null, 'height', height);
            cardRect.setAttributeNS(null, 'ry', '2%');

            cardRect.setAttributeNS(null, 'class', 'card card-front');
            cardGroup.append(cardRect);

            //SUIT
            var suit = null;
            switch(card.suit) {
                case 'c':   suit = SvgSuit.getSvg(SvgSuit.clubs);
                            break;
                case 'h':   suit = SvgSuit.getSvg(SvgSuit.hearts);
                            break;
                case 'd':   suit = SvgSuit.getSvg(SvgSuit.diamonds);
                            break;
                case 's':   suit = SvgSuit.getSvg(SvgSuit.spades);
                            break;
            }

            if(suit) {
                suit.setAttributeNS(null, 'transform', 'translate(-1.8 -1.3) scale(0.01)');
                cardGroup.append(suit);
            }



            //VALUE
            var cardValueSvg = null, cardValueSvgReverse = null;
            var coloredValue = 'Black' + card.value;
            if(card.suit == 'h'|| card.suit == 'd') {
                coloredValue = 'Red' + card.value; 
            }
            if(this.cardValueNodes.hasOwnProperty(coloredValue)) {    //the needed Node already exists
                cardValueSvg = document.createElementNS(xmlns, 'use');
                cardValueSvg.setAttributeNS(null, 'href', '#cardValue' + coloredValue);
                cardGroup.appendChild(cardValueSvg);
            } else {
                cardValueSvg = document.createElementNS(xmlns, 'text');
                cardValueSvg.id = 'cardValue' + coloredValue;
                var cardValueSvgText = document.createTextNode( card.value );
                cardValueSvg.setAttributeNS(null, 'transform', 'translate(.6 1.6)');
                cardValueSvg.appendChild(cardValueSvgText);
                cardGroup.appendChild(cardValueSvg);

                this.cardValueNodes[ coloredValue ] = cardValueSvg;
            }

            //VALUE UPSIDE DOWN
            if(this.cardValueNodes.hasOwnProperty(coloredValue)) {    //the needed Node should already exist
                cardValueSvgReverse = document.createElementNS(xmlns, 'use');
                cardValueSvgReverse.setAttributeNS(null, 'href', '#cardValue' + coloredValue);
                cardValueSvgReverse.setAttributeNS(null, 'transform', 'translate('+ cardWidth + ' ' + cardHeight + ') rotate(180)  ');
                cardGroup.appendChild(cardValueSvgReverse);

            }

            /* Hint on working with 'use':
            *  Pay attention to fill-color of object that ought to be used.
            */
            if(card.suit == 'h'|| card.suit == 'd') {
                cardValueSvg.setAttributeNS(null, "class", 'fill-red');
                cardValueSvgReverse.setAttributeNS(null, "class", 'fill-red');
            }
        }

        return cardGroup;
    }


}