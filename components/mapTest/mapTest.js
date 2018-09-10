var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');

var nodes = [];

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
    for(let i = 0; i < nodes.length; i++) {
        ctx.rect(nodes[i].x, nodes[i].y, 20, 20);
        ctx.stroke();
    }
}

createMap();

main = setInterval(function() {
    clearCanvas();
    draw();
}, 20);