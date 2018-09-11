var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');

var map = [];
var sections = {};
var nodes = [];
var sectionMax = 5;

/*
function createMap() {
    for(let i = 0; i < sectionMax; i++) {
        map.push(createSection(i + 1));
    }
}
*/

function createSection(num) {
    if(num >= sectionMax || num == 1) {
        var nodeCount = 3;
    } else {
        var nodeCount = Math.floor(Math.random() * 3) + 3;
    }
    var nodes = [];
    for(let i = 0; i < nodeCount; i++){
        nodes.push(createNode());
    }
    return section;
}

function createNode() {
    if(map.length == 0) {
        // first section
    } else if(map.length == sectionMax - 1) {
        // last section
    } else {
        // general section

    }
}

$('#back').click(() => {
    changeSection('main', titleComp);
});

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function createMap() {
    for(let i = 0; i < 15; i++) {
        let fx = Math.round(Math.random() * 10) - 20;
        let fy = Math.round(Math.random() * 60) + 20;
        if(i != 0) {
            nodes.push({x: (nodes[i - 1].x + fx), y: (nodes[i - 1].y + fy)});
        } else {
            nodes.push({x: fx + 400, y: fy});
        }
    }
    console.log(nodes);
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

createMap();

main = setInterval(function() {
    clearCanvas();
    draw();
}, 20);

// create first node at bottom center center

function baseNode() {
    let x = c.width / 2 - 10;
    let y = c.height - 60;
    ctx.rect(x, y, 20, 20);
    ctx.stroke();
}

function endNode(){
    let x = c.width / 2 - 10;
    let y = 0;
    ctx.rect(x, y, 20, 20);
    ctx.stroke();
}