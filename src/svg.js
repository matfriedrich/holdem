const xmlns = "http://www.w3.org/2000/svg";

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
        }
    }
}

class OtherPlayer extends SvgPlayer {

    constructor(name, balance){
        console.log("OtherPlayer");

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
        var  height = 7;
        var width = 4;

        var card = document.createElementNS(xmlns, "rect");
        card.setAttributeNS(null, 'width', width);
        card.setAttributeNS(null, 'height', height);
        card.setAttributeNS(null, 'ry', '2%');
        card.setAttributeNS(null, 'transform', 'translate('+ translationX +' -4) rotate('+rotation+ ')');

        card.setAttributeNS(null, 'class', 'card');

        return card;
    }
}

class Svg {

    constructor(parent){
      console.log("SVG");
      this.svg = document.createElementNS(xmlns, "svg");
      this.svg.id = "svgArea";
      this.svg.setAttribute("viewBox", "0 0 100 40"); 

      parent.append(this.svg);
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

    drawTable(pokertable) {
        console.log("SVG: drawTable()");
        console.log("pokertable: ", pokertable)

        this.playerTopGroup = document.createElementNS(xmlns, "g");
        this.playerTopGroup.id = "playerTop";
        this.playerTopGroup.setAttributeNS(null, 'transform', 'translate(50 5)');

        this.playerLeftGroup = document.createElementNS(xmlns, "g");
        this.playerLeftGroup.id = "playerLeft";
        this.playerLeftGroup.setAttributeNS(null, 'transform', 'translate(10 20)');

        this.playerRightGroup = document.createElementNS(xmlns, "g");
        this.playerRightGroup.id = "playerRight";
        this.playerRightGroup.setAttributeNS(null, 'transform', 'translate(90 20)');

        this.svg.append(this.playerTopGroup, this.playerLeftGroup, this.playerRightGroup);

        var ownPlayerID = pokertable.playerId;
        var players = [];   //just to be sure that array index correlates to player's id
        for(let player of pokertable.players) {
            players[player.id] = player;
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



    }


}