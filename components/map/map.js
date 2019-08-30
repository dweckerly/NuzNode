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

var canDrag = true;
var dragging = false;

var startingPos = 1;

var labelText = { txt: "", x: 0, y: 0 };

var pointerAnimY = 0;
var i = 0;

var padding = 6;
var moveAnim;

clearIntervals();

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
            ctx.fillStyle = "#000";
            ctx.fillRect(labelText.x - 1 - padding, labelText.y - 27 - padding, ctx.measureText(labelText.txt).width + 2 + (2 * padding), 32 + (2 * padding));
            ctx.fillStyle = "#FFF";
            ctx.fillRect(labelText.x - padding, labelText.y - 26 - padding, ctx.measureText(labelText.txt).width + (2 * padding), 30 + (2 * padding));
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

function showLocationDetails() {

}

function moveCenterToLocation(loc) {
    canDrag = false;
    clearInterval(moveAnim);
    var interval = 30;
    var dest = centerOnLocation(loc);
    var midDist = Math.sqrt((Math.pow((dest.y - cOffset.y), 2)) + Math.pow((dest.x - cOffset.x), 2)) / 2;
    if (dest.x < cOffset.x) {
        var slope = (dest.y - cOffset.y) / (dest.x - cOffset.x);
        var xMove = -1;
    } else {
        var slope = (cOffset.y - dest.y) / (cOffset.x - dest.x);
        var xMove = 1;
    }
    var intercept = dest.y - (slope * dest.x);
    var accelX, dist;
    moveAnim = setInterval(function() {
        dist = Math.sqrt((Math.pow((dest.y - cOffset.y), 2)) + Math.pow((dest.x - cOffset.x), 2));
        accelX = (dist / midDist) * 6;
        if (accelX < 1) {
            accelX = 1;
        }
        cOffset.x += xMove * accelX;
        cOffset.y = ((slope * cOffset.x) + intercept);
        if (cOffset.x >= (dest.x - 1) && cOffset.x <= (dest.x + 1)) {
            if (cOffset.y <= (dest.y + 1) && cOffset.y >= (dest.y - 1)) {
                cOffset.x = dest.x;
                cOffset.y = dest.y;
                clearInterval(moveAnim);
                canDrag = true;
            }
        }
    }, interval);
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
    if (canDrag) {
        var mousePos = getMousePos(c, evt);
        mouseOffset.x = mousePos.x;
        mouseOffset.y = mousePos.y;
        dragging = true;
    }
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
}, false);

c.addEventListener('click', function(event) {
    event.stopImmediatePropagation();
    locations.forEach((loc) => {
        if (loc.hover) {
            console.log(loc.name);
            moveCenterToLocation(loc);
            startingPos = loc.id;
        }
    });
});

sinAnim = setInterval(function() {
    if (i >= 6.2) {
        i = 0;
    }
    pointerAnimY = (Math.sin(i)) * 20;
    i += 0.1;
}, 30);


main = setInterval(function() {
    draw();
}, 20);