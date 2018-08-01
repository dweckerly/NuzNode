function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
}

function tag(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 25, y + 25);
    ctx.lineTo(x + 100, y + 25);
    ctx.lineTo(x + 100, y - 25);
    ctx.lineTo(x + 25, y - 25);
    ctx.lineTo(x, y);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.stroke();
}

function roundRect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
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
    if (animTracker.imagesAnim) {
        if (opponentImg.x <= endPositions.opponentImg + 0.1) {
            playerImg.x = lerp(playerImg.x, endPositions.playerImg, 0.1);
            if (playerImg.x >= endPositions.playerImg - 0.1) {
                animTracker.imagesAnim = false;
                animTracker.detailsAnim = true;
                showBattleText();
            }
        }
    }
}

function drawDetailsRect() {
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#f7f7f7";
    roundRect(playerDetailsRect.x, playerDetailsRect.y, playerDetailsRect.w, playerDetailsRect.h, playerDetailsRect.radius, true, true);
    roundRect(opponentDetailsRect.x, opponentDetailsRect.y, opponentDetailsRect.w, opponentDetailsRect.h, opponentDetailsRect.radius, true, true);

    if (animTracker.detailsAnim) {
        playerDetailsRect.y = lerp(playerDetailsRect.y, endPositions.playerDetail, 0.05);
        opponentDetailsRect.y = lerp(opponentDetailsRect.y, endPositions.opponentDetail, 0.05);

        playerNameTxt = {
            x: playerDetailsRect.x + 20,
            y: playerDetailsRect.y + 36,
            txt: playerMonName
        };
        
        playerHealthBg = {
            x: playerDetailsRect.x + 20,
            y: playerDetailsRect.y + 60,
            w: 40,
            h: 16
        }
        pHpLabel = {
            x: playerHealthBg.x + 10,
            y: playerHealthBg.y + 13,
            txt: "HP"
        }
        playerHealthRect = {
            x: playerDetailsRect.x + 60,
            y: playerDetailsRect.y + 60,
            w: playerDetailsRect.w - 80,
            h: 16
        };
        playerHealthOverlay = {
            x: playerHealthRect.x,
            y: playerHealthRect.y,
            w: playerHealthRect.w,
            h: playerHealthRect.h
        };
        opponentNameTxt = {
            x: opponentDetailsRect.x + 20,
            y: opponentDetailsRect.y + 36,
            txt: opponentMonName
        };
        
        opponentHealthBg = {
            x: opponentDetailsRect.x + 20,
            y: opponentDetailsRect.y + 60,
            w: 40,
            h: 16
        }
        oHpLabel = {
            x: opponentHealthBg.x + 10,
            y: opponentHealthBg.y + 13,
            txt: "HP"
        }
        opponentHealthRect = {
            x: opponentDetailsRect.x + 60,
            y: opponentDetailsRect.y + 60,
            w: opponentDetailsRect.w - 80,
            h: 16
        };
        opponentHealthOverlay = {
            x: opponentHealthRect.x,
            y: opponentHealthRect.y,
            w: opponentHealthRect.w,
            h: opponentHealthRect.h
        };

        if (playerDetailsRect.y <= endPositions.playerDetail + 0.1) {
            animTracker.detailsAnim = false;
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
    ctx.fillStyle = "#000";
    roundRect(playerHealthBg.x, playerHealthBg.y, playerHealthBg.w, playerHealthBg.h, { tl: 5, bl: 5 }, true, true);
    roundRect(opponentHealthBg.x, opponentHealthBg.y, opponentHealthBg.w, opponentHealthBg.h, { tl: 5, bl: 5 }, true, true);
    ctx.fillStyle = "#888";
    roundRect(playerHealthOverlay.x, playerHealthOverlay.y, playerHealthOverlay.w, playerHealthOverlay.h, { tr: 5, br: 5 }, true, false);
    roundRect(opponentHealthOverlay.x, opponentHealthOverlay.y, opponentHealthOverlay.w, opponentHealthOverlay.h, { tr: 5, br: 5 }, true, false);
    roundRect(playerHealthRect.x, playerHealthRect.y, playerHealthRect.w, playerHealthRect.h, { tr: 5, br: 5 }, false, true);
    roundRect(opponentHealthRect.x, opponentHealthRect.y, opponentHealthRect.w, opponentHealthRect.h, { tr: 5, br: 5 }, false, true);

    ctx.font = "18px Courier New";
    ctx.fillStyle = "#fff";
    ctx.fillText(pHpLabel.txt, pHpLabel.x, pHpLabel.y);
    ctx.fillText(oHpLabel.txt, oHpLabel.x, oHpLabel.y);

}

function drawLevelTag() {
    tag(opponentDetailsRect.x + opponentDetailsRect.w - 60, opponentDetailsRect.y + 30);
    tag(playerDetailsRect.x + playerDetailsRect.w - 60, playerDetailsRect.y + 30);
    playerLvlTxt = {
        x: playerDetailsRect.x + playerDetailsRect.w - 40,
        y: playerDetailsRect.y + 36,
        txt: pLvlTxt
    }
    opponentLvlTxt = {
        x: opponentDetailsRect.x + opponentDetailsRect.w - 40,
        y: opponentDetailsRect.y + 36,
        txt: oLvlTxt
    }
}

function draw() {
    drawImages();
    if (!animTracker.imagesAnim) {
        drawDetailsRect();
        drawLevelTag();
        drawNames();
        drawHealth();
    }
    
}

function update() {
    clearCanvas();
    draw();
    if(!animTracker.imagesAnim && !animTracker.detailsAnim) {
        if(!showingUtil) {
            $('#battle-util-div').fadeIn();
            showingUtil = true;
        }
    }
    requestAnimationFrame(update);
}

update();