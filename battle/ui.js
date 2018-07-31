function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
}

function roundRect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function drawImages() {
    ctx.drawImage(playerImg.img, playerImg.x, playerImg.y, playerImg.w, playerImg.h);
    ctx.drawImage(opponentImg.img, opponentImg.x, opponentImg.y, opponentImg.w, opponentImg.h);
    opponentImg.x = lerp(opponentImg.x, endPositions.opponentImg, 0.1);
    if(!animTracker.imagesDone) {
        if(opponentImg.x <= endPositions.opponentImg + 0.1) {
            playerImg.x = lerp(playerImg.x, endPositions.playerImg, 0.1);
            if(playerImg.x >= endPositions.playerImg - 0.1) {
                animTracker.imagesDone = true;
                showBattleText();
            }
        }
    }
}

function drawDetailsRect() {
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#fff";
    roundRect(playerDetailsRect.x, playerDetailsRect.y, playerDetailsRect.w, playerDetailsRect.h, playerDetailsRect.radius, true, true);
    roundRect(opponentDetailsRect.x, opponentDetailsRect.y, opponentDetailsRect.w, opponentDetailsRect.h, opponentDetailsRect.radius, true, true);
    
    if(!animTracker.detailsDone) {
        playerDetailsRect.y = lerp(playerDetailsRect.y, endPositions.playerDetail, 0.05);
        opponentDetailsRect.y = lerp(opponentDetailsRect.y, endPositions.opponentDetail, 0.05);
        
        playerNameTxt = {
            x: playerDetailsRect.x + (playerDetailsRect.w / 2) - ctx.measureText(playerMonName).width, 
            y: playerDetailsRect.y - 14, 
            txt: playerMonName
        };
        playerLvlTxt = {
            x: playerDetailsRect.x + playerDetailsRect.w - ctx.measureText(pLvlTxt).width,
            y: playerNameTxt.y,
            txt: pLvlTxt
        }
        playerHealthRect = {
            x: playerDetailsRect.x + 20, 
            y: playerDetailsRect.y + 20, 
            w: playerDetailsRect.w - 40, 
            h: 20
        };
        playerHealthOverlay = {
            x: playerHealthRect.x, 
            y: playerHealthRect.y, 
            w: playerHealthRect.w, 
            h: playerHealthRect.h
        };
        opponentNameTxt = {
            x: opponentDetailsRect.x + (opponentDetailsRect.w / 2) - ctx.measureText(opponentMonName).width, 
            y: opponentDetailsRect.y + opponentDetailsRect.h + 28, 
            txt: opponentMonName
        };
        opponentLvlTxt = {
            x: opponentDetailsRect.x + opponentDetailsRect.w - ctx.measureText(oLvlTxt).width,
            y: opponentNameTxt.y,
            txt: oLvlTxt
        }
        opponentHealthRect = {
            x: opponentDetailsRect.x + 20, 
            y: opponentDetailsRect.y + 20, 
            w: opponentDetailsRect.w - 40, 
            h: 20
        };
        opponentHealthOverlay = {
            x: opponentHealthRect.x, 
            y: opponentHealthRect.y, 
            w: opponentHealthRect.w, 
            h: opponentHealthRect.h
        };

        if(playerDetailsRect.y <= endPositions.playerDetail + 0.1) {
            animTracker.detailsDone = true;
        }
    }
    

}

function drawNames() {
    ctx.fillStyle = "black";
    ctx.font = "26px ShadowsIntoLight";
    ctx.fillText(playerNameTxt.txt, playerNameTxt.x, playerNameTxt.y);
    ctx.fillText(opponentNameTxt.txt, opponentNameTxt.x, opponentNameTxt.y);

    ctx.font = "18px Courier New";
    ctx.fillText(playerLvlTxt.txt, playerLvlTxt.x, playerLvlTxt.y);
    ctx.fillText(opponentLvlTxt.txt, opponentLvlTxt.x, opponentLvlTxt.y);
}

function drawHealth() {
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#888";
    roundRect(playerHealthOverlay.x, playerHealthOverlay.y, playerHealthOverlay.w, playerHealthOverlay.h, 5, true, false);
    roundRect(opponentHealthOverlay.x, opponentHealthOverlay.y, opponentHealthOverlay.w, opponentHealthOverlay.h, 5, true, false);
    roundRect(playerHealthRect.x, playerHealthRect.y, playerHealthRect.w, playerHealthRect.h, 5, false, true);
    roundRect(opponentHealthRect.x, opponentHealthRect.y, opponentHealthRect.w, opponentHealthRect.h, 5, false, true);
    
}

function draw() {
    drawImages();
    if(animTracker.imagesDone) {
        drawDetailsRect();
        drawNames();
        drawHealth();
    }
}

function update() {
    clearCanvas();
    draw();
    requestAnimationFrame(update);
}

update();