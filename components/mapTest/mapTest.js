var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');
var cOffset = { x: 0, y: 0 };

var mouseOffset = { x: 0, y: 0 };
var mousePos = { x: 0, y: 0 };

var dragging = false;

var map = [];
var sections = [];
var nodes = [];

var nodeDim = 20;

var sectionMax = 7;
var sectionWidth = 600;
var sectionHeight = 200;

var bNode = {
    x: 0,
    y: 0
};

var eNode = {
    x: 0,
    y: 0
};

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

$('#gen').click(() => {
    resetOffset();
    createBaseNode();
    createEndNode();
    createSections();
    createNodes();
    clearCanvas();
    draw();
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

c.addEventListener('mousewheel', function(evt) {
    if (evt.deltaY > 0) {
        cOffset.y += 10;
    } else {
        cOffset.y -= 10;
    }
    clearCanvas();
    draw();
}, false);

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

function resetOffset() {
    cOffset = { x: 0, y: 0 };
    mouseOffset = { x: 0, y: 0 };
    mousePos = { x: 0, y: 0 };
}

function selectDirection() {
    let r = Math.floor(Math.random() * 4);
    switch (r) {
        case 0:
            return 'east';
        case 1:
            return 'south';
        case 2:
            return 'west';
        case 3:
            return 'north';
    }
}

function createMap() {
    let direction = 'east';
    let depth = 7;

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < depth; j++) {
            nodes.push({
                paths: j + 1
            });
        }
    }
    
}

function createGraph() {

}

function createBaseNode() {
    bNode.x = (c.width / 2) - (nodeDim / 2) + cOffset.x;
    bNode.y = (sectionHeight * sectionMax) + nodeDim + cOffset.y;
}

function baseNode() {
    ctx.fillRect(bNode.x + cOffset.x, bNode.y + cOffset.y, nodeDim, nodeDim);
}

function createEndNode() {
    eNode.x = (c.width / 2) - (nodeDim / 2) + cOffset.x;
    eNode.y = 0 + cOffset.y;
}

function endNode() {
    ctx.fillRect(eNode.x + cOffset.x, eNode.y + cOffset.y, nodeDim, nodeDim);
}

function createSections() {
    sections = [];
    //let sectionHeight = (bNode.y - eNode.y - 20) / sectionMax;
    for (let i = 0; i < sectionMax; i++) {
        sections.push({ x: c.width / 2 - sectionWidth / 2 + cOffset.x, y: sectionHeight * i + eNode.y + nodeDim, w: sectionWidth, h: sectionHeight });
    }
}

function drawSections() {
    for (let i = 0; i < sections.length; i++) {
        ctx.strokeRect(sections[i].x + cOffset.x, sections[i].y + cOffset.y, sections[i].w, sections[i].h);
    }
}

function createNodes() {
    nodes = [];
    for (let i = 0; i < sections.length; i++) {
        let r;
        if (i > 0 && i < sections.length - 1) {
            r = Math.floor(Math.random() * 3) + 3;
        } else {
            r = 3;
        }
        let nodeSectionWidth = sections[i].w / r;
        for (let j = 0; j < r; j++) {
            let x = sections[i].x + nodeSectionWidth * j;
            let w = sections[i].x + nodeSectionWidth * (j + 1);
            let y = sections[i].y;
            let h = sections[i].h;

            let nodeX = (x + ((w - x) / 2)) - (nodeDim / 2);
            let nodeY = (y + h / 2) - (nodeDim / 2);

            let section = i;
            nodes.push({
                x: nodeX,
                y: nodeY,
                section: section
            });
        }
    }
}

function drawNodes() {
    for (let i = 0; i < nodes.length; i++) {
        ctx.strokeRect(nodes[i].x + cOffset.x, nodes[i].y + cOffset.y, nodeDim, nodeDim);
    }
}

function getNodesInSection(sec) {
    let getNodes = [];
    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].section == sec) {
            getNodes.push({
                node: nodes[i],
                index: i
            });
        }
    }
    return getNodes;
}

function createPaths() {
    for(let i = 0; i < sections.length - 1; i++) {
        let fromNodes = getNodesInSection(i);
        let toNodes = getNodesInSection(i + 1);

        // if they are the same length just draw a line to the above node...
        if(fromNodes.length == toNodes.length) {
            console.log(fromNodes);
            console.log(toNodes);
            for(let j = 0; j < fromNodes.length; j++) {
                fromNodes[j].node['paths'] = [fromNodes.length + fromNodes[j].index];
                nodes[fromNodes[j].index] = fromNodes[j].node;
            }
        } 
    }
}

function drawEndPaths() {
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(eNode.x + (nodeDim / 2) + cOffset.x, eNode.y + (nodeDim / 2) + cOffset.y);
        ctx.lineTo(nodes[i].x + (nodeDim / 2) + cOffset.x, nodes[i].y + (nodeDim / 2) + cOffset.y);
        ctx.stroke();
    }
}

function drawStartPaths() {
    for(let i = nodes.length - 1; i > nodes.length - 4; i--) {
        ctx.beginPath();
        ctx.moveTo(bNode.x + (nodeDim / 2) + cOffset.x, bNode.y + (nodeDim / 2) + cOffset.y);
        ctx.lineTo(nodes[i].x + (nodeDim / 2) + cOffset.x, nodes[i].y + (nodeDim / 2) + cOffset.y);
        ctx.stroke();
    }
}

function drawPaths() {
    for(let i = 0; i < nodes.length; i++) {
        if('paths' in nodes[i]) {
            for(let j = 0; j < nodes[i].paths.length; j++) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x + (nodeDim / 2) + cOffset.x, nodes[i].y + (nodeDim / 2) + cOffset.y);
                ctx.lineTo(nodes[nodes[i].paths[j]].x + (nodeDim / 2) + cOffset.x, nodes[nodes[i].paths[j]].y + (nodeDim / 2) + cOffset.y);
                ctx.stroke();
            }
        }
    }
}

function draw() {
    baseNode();
    endNode();
    drawSections();
    drawNodes();
    drawEndPaths();
    drawStartPaths();
    drawPaths();
}

createBaseNode();
createEndNode();
createSections();
createNodes();
createPaths();
console.log(nodes);
draw();