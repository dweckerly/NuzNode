var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');
var playerImg = document.getElementById('player-img');
var opponentImg = document.getElementById('opponent-img');

var winOffset = 20;

var cMinHeight = 640;

$(document).ready(function() {
    setCanvasSize();
});

$(window).resize(function() {
    setCanvasSize();
});

/*
playerImg.onload = function() {
    ctx.drawImage(img, 200, 400);
}
*/

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

function draw() {
    drawOpponentImg();
    drawPlayerImg();
}