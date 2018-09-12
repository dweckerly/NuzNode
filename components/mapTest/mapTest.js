var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');
var cOffset = { x: 0, y: 0 };

var mouseOffset = { x: 0, y: 0 };
var mousePos = { x: 0, y: 0 };

var dragging = false;
var clear = false;

var map = [];
var sections = {};
var nodes = [];
var sectionMax = 5;

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$('#back').click(() => {
    changeSection('main', titleComp);
});

$('#clear').click(() => {
    clearCanvas();
    if (clear) {
        clear = false;
        $('#clear').html("Clear");
    } else {
        clear = true;
        $('#clear').html("Draw");
    }
});

$('#main-canvas').mousedown(function(evt) {
    mousePos = getMousePos(c, evt);
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
    if (dragging) {
        cOffset.x += mousePos.x - mouseOffset.x;
        cOffset.y += mousePos.y - mouseOffset.y;
        mouseOffset.x = mousePos.x;
        mouseOffset.y = mousePos.y;
        clearCanvas();
        draw();
    }
}, false);

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

/*
function createMap() {
    for(let i = 0; i < sectionMax; i++) {
        map.push(createSection(i + 1));
    }
}
*/

function createSection(num) {
    if (num >= sectionMax || num == 1) {
        var nodeCount = 3;
    } else {
        var nodeCount = Math.floor(Math.random() * 3) + 3;
    }
    var nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(createNode());
    }
    return section;
}

function createNode() {
    if (map.length == 0) {
        // first section
    } else if (map.length == sectionMax - 1) {
        // last section
    } else {
        // general section

    }
}

function createMap() {
    for (let i = 0; i < 15; i++) {
        let fx = Math.round(Math.random() * 10) - 20;
        let fy = Math.round(Math.random() * 60) + 20;
        if (i != 0) {
            nodes.push({ x: (nodes[i - 1].x + fx), y: (nodes[i - 1].y + fy) });
        } else {
            nodes.push({ x: fx + 400, y: fy });
        }
    }
    console.log(nodes);
}

//createMap();

function baseNode() {
    let x = c.width / 2 - 10 + cOffset.x;
    let y = c.height - 60 + cOffset.y;
    ctx.fillRect(x, y, 20, 20);
}

function endNode() {
    let x = c.width / 2 - 10 + cOffset.x;
    let y = 0 + cOffset.y;
    ctx.fillRect(x, y, 20, 20);
}

function draw() {
    baseNode();
    endNode();
    /*
    for(let i = 0; i < nodes.length; i++) {
        ctx.rect(nodes[i].x, nodes[i].y, 20, 20);
        ctx.stroke();
    }
    */
}

draw();