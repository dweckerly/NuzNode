const FONT_NAME = 'Arial';

var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');
var winOffset = 20;

var cMinHeight = 640;

var imgRectMaxWidth = 256;
var imgRectMaxHeight = 256;

var rectWidth = imgRectMaxWidth;
var rectHeight = imgRectMaxHeight;

var healthRectHeight = rectHeight / 8;
var healthRectWidth = rectWidth;

var buttonRectWidth = imgRectMaxWidth / 1.2;
var buttonRectHeight = imgRectMaxHeight / 4;

var fontSize = Math.round(rectWidth / 8.5);

var playerHealthRectPos = {
    'x': 0,
    'y': 0
}

var opponentHealthRectPos = {
    'x': 0,
    'y': 0
}


var playerImgPos = {
    'x': 0,
    'y': 0
}

var opponentImgPos = {
    'x': 0,
    'y': 0
}

var buttonPanel = {
    '1': {
        'x': 0,
        'y': 0,
        'function': 'Fight'
    },
    '2': {
        'x': 0,
        'y': 0,
        'function': 'NuzMon'
    },
    '3': {
        'x': 0,
        'y': 0,
        'function': 'Items'
    },
    '4': {
        'x': 0,
        'y': 0,
        'function': 'Run'
    }
}


$(document).ready(function() {
    setCanvasSize();
});

$(window).resize(function() {
    setCanvasSize();
});

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function setCanvasSize() {
    if ($(window).height() < cMinHeight) {
        c.height = cMinHeight;
    } else {
        c.height = $(window).height() - winOffset;
    }
    c.width = (c.height / 5) * 4;
    if ($(window).width() < c.width) {
        c.width = $(window).width() - winOffset;
        c.height = ((c.width / 4) * 5) - winOffset
    }
    draw();
}

function drawOpponentImgRect() {
    ctx.rect(opponentImgPos['x'], opponentImgPos['y'], rectWidth, rectHeight);
    ctx.stroke();
}

function drawOpponentHealthRect() {
    ctx.rect(opponentHealthRectPos['x'], opponentHealthRectPos['y'], healthRectWidth, healthRectHeight);
    ctx.stroke();
}

function drawPlayerImgRect() {
    ctx.rect(playerImgPos['x'], playerImgPos['y'], rectWidth, rectHeight);
    ctx.stroke();
}

function drawPlayerHealthRect() {
    ctx.rect(playerHealthRectPos['x'], playerHealthRectPos['y'], healthRectWidth, healthRectHeight);
    ctx.stroke();
}

function drawButtonPanel() {
    for(var i = 1; i <= 4; i++) {
        ctx.rect(buttonPanel[i]['x'], buttonPanel[i]['y'], buttonRectWidth, buttonRectHeight);
        ctx.stroke();
    }
}

function drawButtonFunctions() {
    for(var i = 1; i <= 4; i++) {
        var txt = buttonPanel[i]['function'];
        var txtW = ctx.measureText(txt).width;
        var txtH = fontSize;
        var txtX = (buttonPanel[i]['x'] + (buttonRectWidth / 2)) - (txtW / 2);
        var txtY = (buttonPanel[i]['y'] + (buttonRectHeight / 2)) + (txtH / 2);
        ctx.fillText(txt, txtX, txtY);
    }
}

function setImgRectSize() {
    var w = Math.round(c.width * 0.4);
    var h = Math.round(c.height * 0.4);
    if (w > imgRectMaxWidth) {
        w = imgRectMaxWidth;
    }
    if (h > imgRectMaxHeight) {
        h = imgRectMaxHeight;
    }

    if (w > h) {
        w = h;
    }
    if (h > w) {
        h = w;
    }
    rectWidth = w;
    rectHeight = h;
}

function setHealthRectSize() {
    healthRectHeight = rectHeight / 8;
    healthRectWidth = rectWidth;
}

function setPlayerRectPos() {
    playerImgPos['x'] = 0;
    playerImgPos['y'] = rectHeight;
}

function setPlayerHealthPos() {
    playerHealthRectPos['x'] = playerImgPos['x'] + healthRectWidth + (healthRectHeight * 3);
    playerHealthRectPos['y'] = playerImgPos['y'] + ((rectHeight / 2) - (healthRectHeight / 2));
}

function setOpponentRectPos() {
    opponentImgPos['x'] = c.width - rectWidth;
    opponentImgPos['y'] = 0;
}

function setOpponentHealthPos() {
    opponentHealthRectPos['x'] = opponentImgPos['x'] - healthRectWidth - (healthRectHeight * 3);
    opponentHealthRectPos['y'] = opponentImgPos['y'] + ((rectHeight / 2) - (healthRectHeight / 2));
}

function setButtonPanelPos() {
    for(var i = 1; i <= 4; i++) {
        if((i - 1) % 2 == 0) {
            buttonPanel[i]['x'] = (c.width / 2) - buttonRectWidth;
        } else {
            buttonPanel[i]['x'] = (c.width / 2);
        }

        if(i < 3) {
            buttonPanel[i]['y'] = (c.height * (3 / 4))
        } else {
            buttonPanel[i]['y'] = (c.height * (3 / 4)) + buttonRectHeight;
        }
    }
}

function setButtonPanelSize() {
    buttonRectWidth = rectWidth / 1.2;
    buttonRectHeight = rectHeight / 4;
}

function setFont() {
    fontSize = Math.round(rectWidth / 8.5);
    ctx.font = `${fontSize}px "${FONT_NAME}"`;
}

function draw() {
    clearCanvas();
    setImgRectSize();
    setPlayerRectPos();
    setOpponentRectPos();
    drawOpponentImgRect();
    drawPlayerImgRect();

    setHealthRectSize();
    setPlayerHealthPos();
    setOpponentHealthPos();
    drawOpponentHealthRect();
    drawPlayerHealthRect();

    setButtonPanelSize();
    setButtonPanelPos();
    drawButtonPanel();
    setFont();
    drawButtonFunctions();
}

function drawOpponentImg() {
    var h = Math.round(c.width * 0.4);
    var w = Math.round(c.width * 0.4);
    var x = c.width - w;
    var y = 0;
    ctx.drawImage(opponentImg, x, y, w, h);
}

function drawPlayerImg() {
    var h = Math.round(c.width * 0.4);
    var w = Math.round(c.width * 0.4);
    var x = 0;
    var y = h;
    ctx.drawImage(playerImg, x, y, w, h);
}

function setImgSize() {
    var h = Math.round(c.height * 0.4);
    var w = Math.round(c.height * 0.4);
    playerImg.height = h;
    playerImg.width = w;
    opponentImg.height = h;
    opponentImg.width = w;
}