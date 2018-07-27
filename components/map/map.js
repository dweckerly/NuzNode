var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');
var mapImg = document.getElementById('map-img');
var pointerImg = document.getElementById('pointer-img');

var winOffset = 20;

var cMinHeight = 620;
var cMinWidth = 340;

var cOffset = { x: 0, y: 0 };
var mouseOffset = { x: 0, y: 0 };
var mousePos = { x: 0, y: 0 };

var dragging = false;

var startingPos = 1;

const ranch = { x: 1197, y: 562, w: 91, h: 80, name: 'Ranch', hover: false, id: 1 };
const forest = { x: 1374, y: 690, w: 110, h: 100, name: 'Forest', hover: false, id: 2 };
const lake = { x: 1000, y: 736, w: 176, h: 96, name: 'Lake', hover: false, id: 3 };
const cave = { x: 958, y: 506, w: 100, h: 70, name: 'Cave', hover: false, id: 4 };
const hills = { x: 1160, y: 910, w: 100, h: 100, name: 'Hills', hover: false, id: 5 };
const hotel = { x: 530, y: 1150, w: 100, h: 100, name: 'Hotel', hover: false, id: 6 };
const lightHouse = { x: 820, y: 1450, w: 100, h: 120, name: 'Light House', hover: false, id: 7 };
const marsh = { x: 1340, y: 1176, w: 120, h: 140, name: 'Marsh', hover: false, id: 8 };

const locations = [cave, ranch, lake, forest, hills, hotel, lightHouse, marsh];

var labelText = { txt: "", x: 0, y: 0 };

var pointerAnimY = 0;
var i = 0;
// instantiate

$(document).ready(function() {
    cOffset = centerOnLocation(ranch);
    setCanvasSize();
});

$(window).resize(function() {
    setCanvasSize();
});

function setCanvasSize() {
    if ($(window).height() < cMinHeight) {
        c.height = cMinHeight;
    } else {
        c.height = $(window).height() - winOffset;
    }
    if ($(window).width() < cMinWidth) {
        c.width = cMinWidth;
    } else {
        c.width = $(window).width() - winOffset;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawLocationLabels() {
    var hovering = false;
    locations.forEach((loc) => {
        if (loc.hover) {
            ctx.fillStyle = "red";
            ctx.fillRect(labelText.x, labelText.y - 26, ctx.measureText(labelText.txt).width, 30);
            ctx.fillStyle = "black";
            ctx.font = "30px Amatic";
            ctx.fillText(labelText.txt, labelText.x, labelText.y);
            hovering = true;
        }
        if (startingPos == loc.id) {
            ctx.drawImage(pointerImg, cOffset.x + loc.x + ((loc.w / 2) - (pointerImg.width / 2)), cOffset.y + loc.y - pointerImg.height + pointerAnimY);
        }
    });
    if (hovering) {
        $('#main-canvas').css('cursor', 'pointer');
    } else {
        $('#main-canvas').css('cursor', 'default');
    }
}

function draw() {
    clearCanvas();
    ctx.drawImage(mapImg, cOffset.x, cOffset.y);
    drawLocationLabels();
}

function getCanvasCenter() {
    var x = $(window).width() / 2;
    var y = $(window).height() / 2;
    return { x: x, y: y };
}

function centerOnLocation(loc) {
    var center = getCanvasCenter();
    var x = center.x - loc.x - (loc.w / 2);
    var y = center.y - loc.y - (loc.h / 2);
    return { x: x, y: y };
}

function hoverOverLocation() {
    locations.forEach((loc) => {
        var minX = cOffset.x + loc.x;
        var maxX = (cOffset.x + loc.x) + loc.w;
        var minY = cOffset.y + loc.y;
        var maxY = (cOffset.y + loc.y) + loc.h;
        if (mousePos.x >= minX && mousePos.x <= maxX &&
            mousePos.y >= minY && mousePos.y <= maxY) {
            labelText = {
                txt: loc.name,
                x: minX,
                y: minY
            };
            loc.hover = true;
        } else {
            loc.hover = false;
        }
    });
}


// mouse functions

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$('#main-canvas').mousedown(function(evt) {
    var mousePos = getMousePos(c, evt);
    mouseOffset.x = mousePos.x;
    mouseOffset.y = mousePos.y;
    dragging = true;
});

$('#main-canvas').mouseleave(function() {
    if (dragging) {
        dragging = false;
    }
});

$('#main-canvas').mouseup(function() {
    if (dragging) {
        dragging = false;
    }
});

c.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(c, evt);
    hoverOverLocation();
    if (dragging) {
        cOffset.x += mousePos.x - mouseOffset.x;
        cOffset.y += mousePos.y - mouseOffset.y;
        mouseOffset.x = mousePos.x;
        mouseOffset.y = mousePos.y;
    }
    //draw();
}, false);

c.addEventListener('click', function(event) {
    event.stopImmediatePropagation();
    locations.forEach((loc) => {
        if (loc.hover) {
            console.log(loc.name);
            startingPos = loc.id;
        }
    });
});

var sinAnim = setInterval(function() {
    if (i >= 6.2) {
        i = 0;
    }
    pointerAnimY = (Math.sin(i)) * 20;
    i += 0.1;
}, 30);

var main = setInterval(function() {
    draw();
}, 15);