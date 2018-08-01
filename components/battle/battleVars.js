var c = document.getElementById('battle-canvas');
var ctx = c.getContext('2d');

var playerMonName = "Derple";
var playerMonLvl = 3;
var pLvlTxt = "lvl. " + playerMonLvl
var opponentMonName = "Embah";
var opponentMonLvl = 3;
var oLvlTxt = "lvl. " + opponentMonLvl

var animTracker = {
    imagesAnim: true,
    detailsAnim: false
}

var showingUtil = false;

var endPositions = {
    playerImg: 44,
    opponentImg: 450,
    playerDetail: 310,
    opponentDetail: -1
}

var playerImg = { x: -256, y: 144, w: 256, h: 256, img: document.getElementById('player-img') };
var playerDetailsRect = { x: 400, y: 400, w: 300, h: 90, radius: { tl: 20, br: 20 } };
var playerNameTxt = {
    x: playerDetailsRect.x + (playerDetailsRect.w / 2) - ctx.measureText(playerMonName).width,
    y: playerDetailsRect.y - 14,
    txt: playerMonName
};
var playerLvlTxt = {
    x: playerDetailsRect.x + playerDetailsRect.w - ctx.measureText(pLvlTxt).width,
    y: playerNameTxt.y,
    txt: pLvlTxt
}
var playerHealthRect = {
    x: playerDetailsRect.x + 20,
    y: playerDetailsRect.y + 20,
    w: playerDetailsRect.w - 40,
    h: 16
};
var playerHealthOverlay = {
    x: playerHealthRect.x,
    y: playerHealthRect.y,
    w: playerHealthRect.w,
    h: playerHealthRect.h
};
var playerHealthBg = {
    x: playerHealthRect.x,
    y: playerHealthRect.y,
    w: playerHealthRect.w,
    h: playerHealthRect.h
}
var pHpLabel = {
    x: 0,
    y: 0,
    txt: "HP"
}
var playerStatus = { x: 0, y: 0, txt: "" };
var playerExpRect = { x: 0, y: 0, w: 0, h: 0 };
var playerExpOverlay = { x: 0, y: 0, w: 0, h: 0 };


var opponentImg = { x: 1006, y: 0, w: 256, h: 256, img: document.getElementById('opponent-img') };
var opponentDetailsRect = { x: 50, y: -91, w: 300, h: 90, radius: { tr: 20, bl: 20 } };
var opponentNameTxt = {
    x: opponentDetailsRect.x + (opponentDetailsRect.w / 2) - ctx.measureText(opponentMonName).width,
    y: opponentDetailsRect.y + opponentDetailsRect.h + 28,
    txt: opponentMonName
};
var opponentLvlTxt = {
    x: opponentDetailsRect.x + opponentDetailsRect.w - (ctx.measureText(oLvlTxt).width * 2),
    y: opponentNameTxt.y,
    txt: oLvlTxt
}
var opponentHealthRect = {
    x: opponentDetailsRect.x + 60,
    y: opponentDetailsRect.y + 60,
    w: opponentDetailsRect.w - 40,
    h: 16
};
var opponentHealthOverlay = {
    x: opponentHealthRect.x,
    y: opponentHealthRect.y,
    w: opponentHealthRect.w,
    h: opponentHealthRect.h
};
var opponentHealthBg = {
    x: opponentHealthRect.x,
    y: opponentHealthRect.y,
    w: opponentHealthRect.w,
    h: opponentHealthRect.h
}
var oHpLabel = {
    x: 0,
    y: 0,
    txt: "HP"
}
var opponentStatus = { x: 0, y: 0, txt: "" };