var animating = false;
var animation;
var animI = 0;
var animQueue = [];
var animTarget;

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
    t /= 2000;
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

function easeInBack (min, change, time, duration) {
    let s = 1.70158;
    return change*(time/=duration)*time*((s+1)*animI - s) + min;
}

function cosMove(radius, speed, step){
    return startPos.x + radius * Math.cos(speed * step);
}

function sinMove(radius, speed, step) {
    return startPos.y + radius * Math.sin(speed * step);
}

function backCosMove(radius, speed, step){
    return startPos.x - radius * Math.cos(speed * step);
}

function backSinMove(radius, speed, step) {
    return startPos.y - radius * Math.sin(speed * step);
}



function circleForward() {
    animTarget.x = cosMove(60, 0.1, animI) - 60;
    animTarget.y = sinMove(60, 0.1, animI);
    animI++;
    if(animI >= 65) {
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function circleCounterForward() {
    animTarget.x = cosMove(60, -0.1, animI) - 60;
    animTarget.y = sinMove(60, -0.1, animI);
    animI++;
    if(animI >= 65) {
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function circleBack() {
    animTarget.x = backCosMove(60, 0.1, animI) + 60;
    animTarget.y = backSinMove(60, 0.1, animI);
    animI++;
    if(animI >= 65) {
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function circleCounterBack() {
    animTarget.x = backCosMove(60, -0.1, animI) + 60;
    animTarget.y = backSinMove(60, -0.1, animI);
    animI++;
    if(animI >= 65) {
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function hop() {
    animTarget.y = parabolaSimple(startPos.y, 20);
    if(animTarget.y < startPos.y) {
        animI += 1;   
    } else {
        animTarget.y = startPos.y;
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function jump() {
    animTarget.y = parabolaSimple(startPos.y, 60);
    if(animTarget.y < startPos.y) {
        animI += 2;   
    } else {
        animTarget.y = startPos.y;
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function jumpRight() {
    animTarget.y = parabolaWithMove(animTarget.x, 60, startPos.y + 60);
    if(animTarget.y < startPos.y) {
        animTarget.x += 2.5;
    } else {
        animTarget.y = startPos.y;
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function jumpLeft() {
    animTarget.y = -(parabolaWithMove(animTarget.x, 60, startPos.y + 60));
    if(animTarget.y < startPos.y) {
        animTarget.x -= 2.5;
    } else {
        animTarget.y = startPos.y;
        stopAnimation();
    }
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function jumpFlip() {
    animTarget.y = parabolaSimple(startPos.y, 60);
    backFlip();
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function mirrorImage() {
    animI++;
    animTarget.x = mirrorMove();
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animI > 80) {
        stopAnimation();
    }
}

function frontFlip() {
    ctx.save();
    animI = easeOutCubic(animI, 360, 100);
    ctx.translate(animTarget.x + (animTarget.w / 2), animTarget.y + (animTarget.h / 2));
    ctx.rotate(-(animI * Math.PI / 180));
    ctx.translate(-(animTarget.x + (animTarget.w / 2)), -(animTarget.y + (animTarget.h / 2)));
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    ctx.restore();
    if(animI >= 359.99) {
        stopAnimation();
    }
}

function backFlip() {
    ctx.save();
    animI = easeOutCubic(animI, 360, 100);
    ctx.translate(animTarget.x + (animTarget.w / 2), animTarget.y + (animTarget.h / 2));
    ctx.rotate(animI * Math.PI / 180);
    ctx.translate(-(animTarget.x + (animTarget.w / 2)), -(animTarget.y + (animTarget.h / 2)));
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    ctx.restore();
    if(animI >= 359.99) {
        stopAnimation();
    }
}

function shake() {
    
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
}

function lerpToStart() {
    animTarget.x = lerp(animTarget.x, startPos.x, 0.1);
    animTarget.y = lerp(animTarget.y, startPos.y, 0.1);
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= (startPos.x - 0.1) && animTarget.x <= (startPos.x + 0.1)
    && animTarget.y >= (startPos.y - 0.1) && animTarget.y <= (startPos.y + 0.1)) {
        stopAnimation();
    }
}

function lerpToLeft() {
    animTarget.x = lerp(animTarget.x, startPos.x - 60, 0.1);
    animTarget.y = lerp(animTarget.y, startPos.y, 0.1);
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= (startPos.x - 60.1) && animTarget.x <= (startPos.x - 59.9)
    && animTarget.y >= (startPos.y - 0.1) && animTarget.y <= (startPos.y + 0.1)) {
        stopAnimation();
    }
}

function lerpToRight() {
    animTarget.x = lerp(animTarget.x, startPos.x + 60, 0.1);
    animTarget.y = lerp(animTarget.y, startPos.y, 0.1);
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= (startPos.x - 59.9) && animTarget.x <= (startPos.x + 60.1)
    && animTarget.y >= (startPos.y - 0.1) && animTarget.y <= (startPos.y + 0.1)) {
        stopAnimation();
    }
}

function moveRight() {
    animTarget.x += 5;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= startPos.x + 60) {
        stopAnimation();
    }
}

function moveFastRight() {
    animTarget.x += 25;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= startPos.x + 120) {
        stopAnimation();
    }
}

function moveLeft() {
    animTarget.x -= 5;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x <= startPos.x - 60) {
        stopAnimation();
    }
}

function moveFastLeft() {
    animTarget.x -= 25;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x <= startPos.x - 120) {
        stopAnimation();
    }
}

function rushRight() {
    animTarget.x = easeInBack(startPos.x, startPos.x + 120, animI, 4);
    animI += 0.08;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x >= startPos.x + 120) {
        stopAnimation();
    }
}

function rushLeft() {
    animTarget.x = easeInBack(startPos.x, startPos.x + 120, animI, 4);
    animI -= 0.08;
    ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
    if(animTarget.x <= startPos.x - 120) {
        stopAnimation();
    }
}


function runAnimQueue() {
    switch(animation) {
        case 'circlef':
            circleForward();
            break;
        case 'circleb':
            circleBack();
            break;
        case 'circlecounterf':
            circleCounterForward();
            break;
        case 'circlecounterb':
            circleCounterBack();
            break;
        case 'flipB':
            backFlip();
            break;
        case 'flipF':
            frontFlip();
            break;
        case 'hop':
            hop(); 
            break;
        case 'jump':
            jump();
            break;
        case 'jumpflip':
            jumpFlip();
            break;
        case 'jumpR':
            jumpRight();
            break;
        case 'jumpL':
            jumpLeft();
            break;
        case 'ltostart' :
            lerpToStart();
            break;
        case 'ltoleft' :
            lerpToLeft();
            break;
        case 'ltoright' :
            lerpToRight();
            break;
        case 'mirimg':
            mirrorImage();
            break;
        case 'mover':
            moveRight();
            break;
        case 'movel':
            moveLeft();
            break;
        case 'movefr':
            moveFastRight();
            break;
        case 'movefl':
            moveFastLeft();
            break;
        case 'rushr':
            rushRight();
            break;
        case 'rushl':
            rushLeft();
            break;
        default:
            ctx.drawImage(animTarget.img, animTarget.x, animTarget.y, animTarget.w, animTarget.h);
            break;
    }
}
function nextAnim() {
    animation = animQueue.shift();
}

function stopAnimation() {
    animI = 0;
    if(animQueue.length > 0) {
        console.log("nextAnim");
        nextAnim();
    } else {
        console.log("stopped");
        animating = false;
        animImg.x = startPos.x;
        animImg.y = startPos.y;
        animImg.w = 256;
        animImg.h = 256;
        $('#anim-btn-basic').prop('disabled', false);
        $('#anim-btn-chain').prop('disabled', false);
    }
}

function startAnimation() {
    $('#anim-btn-basic').prop('disabled', true);
    $('#anim-btn-chain').prop('disabled', true);
    nextAnim();
    animTarget = animImg;
    animating = true;
}

$('#anim-stop').click(() => {
    stopAnimation();
});

$('#anim-btn-basic').click(() => {
    let val = $('#anim-select-basic').val();
    animQueue.push(val);
    startAnimation();
});

$('#anim-btn-chain').click(() => {
    let val = $('#anim-select-chain').val();
    let split = val.split('-');
    split.forEach((e) => {
        animQueue.push(e);
    });
    startAnimation();
});

function drawImages(){
    ctx.drawImage(refImg.img, refImg.x, refImg.y, refImg.w, refImg.h);
    if(animating) {
        runAnimQueue();
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
