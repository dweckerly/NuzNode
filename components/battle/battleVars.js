var c = document.getElementById('battle-canvas');
var ctx = c.getContext('2d');

function createStatusString(mon) {
    var str = ""
    for(let i = 0; i < mon.status.length; i++) {
        str += mon.status[i] + "-";
    } 
    str = str.substring(0, str.length - 1);
    return str;
}

var currentPlayerMon, currentOpponentMon;
for(let i = 0; i < partyMons.length; i++) {
    if(partyMons[i]['partyPosition'] == 1) {
        currentPlayerMon = partyMons[i];
    }
}

var inBattle = [];
inBattle.push(currentPlayerMon);

var playerMonName = currentPlayerMon['name'];
var playerMonLvl = currentPlayerMon['level'];
var pLvlTxt = "lvl. " + playerMonLvl
$('#player-img').attr('src', currentPlayerMon.img);
var playerStatusTxt = createStatusString(currentPlayerMon);


if(battleType === 'wild') {
    console.log(wildMon);
    currentOpponentMon = wildMon;
    currentOpponentMon['ai'] = "random";
} else if(battleType === 'trainer') {
    var opponentMons = [];
}

var opponentMonName = currentOpponentMon.name;
var opponentMonLvl = currentOpponentMon.level;
var oLvlTxt = "lvl. " + currentOpponentMon.level;
$('#opponent-img').attr('src', currentOpponentMon.img);

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
    w: playerDetailsRect.w - 80,
    h: 16
};
var playerHealthOverlay = {
    x: playerHealthRect.x,
    y: playerHealthRect.y,
    w: playerHealthRect.w,
    h: playerHealthRect.h
};

currentPlayerMon['healthDisplay'] = playerHealthOverlay;

var playerHealthBg = {
    x: playerHealthRect.x,
    y: playerHealthRect.y,
    w: 42,
    h: 16
}
var pHpLabel = {
    x: 0,
    y: 0,
    txt: "HP"
}
var playerStatus = { x: 0, y: 0, txt: playerStatusTxt };
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
    w: opponentDetailsRect.w - 80,
    h: 16
};
var opponentHealthOverlay = {
    x: opponentHealthRect.x,
    y: opponentHealthRect.y,
    w: opponentHealthRect.w,
    h: opponentHealthRect.h
};

currentOpponentMon['healthDisplay'] = opponentHealthOverlay;

var opponentHealthBg = {
    x: opponentHealthRect.x,
    y: opponentHealthRect.y,
    w: 42,
    h: opponentHealthRect.h
}
var oHpLabel = {
    x: 0,
    y: 0,
    txt: "HP"
}
var opponentStatus = { x: 0, y: 0, txt: createStatusString(currentOpponentMon) };

var actions = {
    player: {
        action: "",
        id: 0
    },
    opponent: {
        action: "",
        id: 0
    }  
};

var phases = ['select', 'pre', 'main', 'post'];
var phaseCounter = 0;

var playerMods = {
    atk: {value: 1, count: 0}, def: {value: 1, count: 0}, sAtk: {value: 1, count: 0}, sDef: {value: 1, count: 0},
    speed: {value: 1, count: 0}, acc: {value: 1, count: 0}, eva: {value: 1, count: 0}, crit: {value: 1, count: 0}
}

var opponentMods = {
    atk: {value: 1,count: 0}, def: {value: 1, count: 0}, sAtk: {value: 1, count: 0}, sDef: {value: 1, count: 0},
    speed: {value: 1, count: 0}, acc: {value: 1, count: 0}, eva: {value: 1, count: 0}, crit: {value: 1, count: 0}
}

var textInterval, damageInterval, animationInterval, statusInterval;

var actionCount = 0;
var actionQueue = [];
var turn = [];
var turnCount = 0;

var statusCounter = {
    player: {
        daze: {count: 0, max: 1},
        sleep: {count: 0, max: 5},
        stun: {count: 0, max: 5}
    },
    opponent: {
        daze: {count: 0, max: 1},
        sleep: {count: 0, max: 5},
        stun: {count: 0, max: 5}
    }
}

var mustSwitch = false;