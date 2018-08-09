var animTime = 1500;
var animInterval;
var calledInterval = false;
animating = false;
var animI = 0;
var animFunc;

var c = document.getElementById('anim-canvas');
var ctx = c.getContext('2d');

var startPos = {
    x: 300,
    y: 20
}

var animImg = { 
    x: startPos.x, 
    y: startPos.y, 
    w: 256, h: 256, img: document.getElementById('anim-img') 
};

var refImg = {
    x: -50,
    y: -50,
    w: 256, h: 256, img: document.getElementById('ref-img')
}

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
}

function mirrorMove() {
    if(animI % 2) {
        return startPos.x + 20;
    } else {
        return startPos.x - 20;
    }
}

function easeOutCubic(min, max, t) {
    t /= animTime;
    t--;
    return (max - min) * (t*t*t + 1) + min;
}

function easeOutQuad(min, max, fraction) {
    return -(max - min) * fraction*(fraction - 2) + min;
}

function easeInQuad(min, max, fraction) {
    return (max - min) * fraction*fraction + min;
}

function parabolaSimple(start, dist) {
    return -((start + dist)*Math.sin(animI * Math.PI / dist));
}

function parabolaWithMove(x, dist, height) {
    return height*Math.sin(x * Math.PI / dist);
}

function jump(img) {
    img.y = parabolaSimple(startPos.y, 60);
    if(img.y < startPos.y) {
        animI += 2;   
    } else {
        img.y = startPos.y;
    }
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
}

function jumpRight(img) {
    img.y = parabolaWithMove(img.x, 60, startPos.y + 60);
    if(img.y < startPos.y) {
        img.x += 2.5;
    } else {
        img.y = startPos.y;
    }
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
}

function jumpLeft(img) {
    if(img.y < startPos.y) {
        img.x -= 2.5;
    }
    img.y = -(parabolaWithMove(img, 60, startPos.y + 60));
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
}

function mirrorImage(img) {
    animI++;
    img.x = mirrorMove();
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
}

function spin(img) {
    ctx.save();
    animI = easeOutCubic(animI, 360, 100);
    ctx.translate(img.x + (img.w / 2), img.y + (img.h / 2));
    ctx.rotate(animI * Math.PI / 180);
    ctx.translate(-(img.x + (img.w / 2)), -(img.y + (img.h / 2)));
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
    ctx.restore();
}

function shake(img) {
    
}

function animate(img) {
    if(!calledInterval) {
        calledInterval = true;
        animInterval = setInterval(() => {
            stopAnimation();
        }, animTime);
    }
    switch(animFunc) {
        case 'jump':
            jump(img);
            break;
        case 'jumpR':
            jumpRight(img);
            break;
        case 'jumpL':
            jumpLeft(img);
            break;
        case 'mirrorImage':
            mirrorImage(img);
            break;
        case 'spin' :
            spin(img);
            break;
        case 'shake' :
            shake(img);
            break;
        default:
            break;
    }
    
    
}

function stopAnimation() {
    animI = 0;
    animating = false;
    clearInterval(animInterval);
    animImg.x = startPos.x;
    animImg.y = startPos.y;
    animImg.w = 256;
    animImg.h = 256;
    $('#anim-btn').prop('disabled', false);
}

function drawImages(){
    ctx.drawImage(refImg.img, refImg.x, refImg.y, refImg.w, refImg.h);
    if(animating) {
        animate(animImg);
    } else {
        ctx.drawImage(animImg.img, animImg.x, animImg.y, animImg.w, animImg.h);
    }
}

function draw() {
    drawImages();
}

function update() {
    clearCanvas();
    draw();
    requestAnimationFrame(update);
}
update();


$('#anim-btn').click(() => {
    $('#anim-btn').prop('disabled', true);
    animFunc = $('#anim-select').val();
    animating = true;
    calledInterval = false;
});
