function round() {
    actionQueue = [];
    if(phases[phaseCounter] == 'pre') {
        preBattlePhase();
    } else if (phases[phaseCounter] == 'main') {
        mainBattlePhase();
    } else if (phases[phaseCounter] == 'post') {
        postBattlePhase();
    }
    phaseCounter++;
    if(phaseCounter >= 4) {
        phaseCounter = 0;
    }
}

function preBattlePhase() {
    checkSpeed();
    for(let i = 0 ; i < turn.length; i++) {
        if (actions[turn[i]].action == "switch") {
            switchMon();
        } else if (actions[turn[i]].action == "item") {
            useItem();
        }
    }
    round();
}

function mainBattlePhase() {
    checkSpeed();
    if(actions.player.action == "attack" && actions.opponent.action == "attack") {
        checkPriority();
    }
    for(let i = 0 ; i < turn.length; i++) {
        if (actions[turn[i]].action == "attack") {
            parseAttack();
        }
    }
    round();
}

function postBattlePhase() {

}

function showBattleText(txt) {
    typeWriter('battle-text', txt);
    var time = (txt.length * 20) + 500;
    textInterval = setInterval(() => {
        clearInterval(textInterval);
        nextAction();
    }, time);
}

function nextAction() {

}

function checkSpeed() {
    turn = [];
    let pSpeed = parseInt(currentPlayerMon.stats.speed) + playerMods.speed;
    let oSpeed = parseInt(currentOpponentMon.stats.speed) + opponentMods.speed;
    if(pSpeed > oSpeed) {
        turn = ["player", "opponent"];
    } else if (oSpeed > pSpeed) {
        turn = ["opponent", "player"];
    } else if (pSpeed == oSpeed) {
        let chance = Math.random();
        if(chance >= 0.5) {
            turn = ["player", "opponent"];
        } else {
            turn = ["opponent", "player"];
        }
    }
}

function checkPriority() {
    var oEff = currentOpponentMon.moves[actions.opponent.id].effects;
    var pEff = currentPlayertMon.moves[actions.player.id].effects;
    var oP = 0;
    var pP = 0;
    
    for(let i = 0; i < oEff.length; i++) {
        if(oEff[i].includes("priority")) {
            let p = oEff[i].split('-');
            oP = p[1];
        }
    }
    for(let i = 0; i < pEff.length; i++) {
        if(pEff[i].includes("priority")) {
            let p = oEff[i].split('-');
            pP = p[1];
        }
    }

    if(oP > pP) {
        turn = ["opponent", "player"];
    } else if (pP > oP) {
        turn = ["player", "opponent"];
    }
}

function switchMon() {

}

function useItem() {

}

function parseAttack() {

}

function setPreBattleActionQueue() {

}