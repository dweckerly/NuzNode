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
            switchMon(turn[i]);
        } else if (actions[turn[i]].action == "item") {
            useItem(turn[i]);
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
            parseAttack(turn[i]);
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

function switchMon(id) {

}

function useItem(id) {

}

function parseAttack(id) {
    if(id == 'player') { 
        actionQueue.push({
            method: 'text',
            txt: currentPlayerMon.name + " uses " + currentPlayerMon.moves[actions[id]['id']].name + "!"
        });
        if (currentPlayerMon.moves[actions[id]['id']].range == 'self') {
            if(selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc)) {
                if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                } else {
                    if(currentPlayerMon.moves[actions[id]['id']].effects.length > 0) {
                        applyDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, currentPlayertMon);
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    } else {
                        applyDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, currentOpponentMon);
                    }
                }
            }
        } else if (currentPlayerMon.moves[actions[id]['id']].range == 'all') {
            if(selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc)) {
                if(targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc, opponentMods.eva)) {
                    if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    } else {
                    
                    }
                }
            }
        } else {
            if(targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc, opponentMods.eva)) {
                applyDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, currentOpponentMon);
                parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
            }
        }
    } else if (id == 'opponent') {
        actionQueue.push({
            method: 'text',
            txt: currentOpponentMon.name + " uses " + currentOpponentMon.moves[actions[id]['id']].name + "!"
        });
        if(currentOpponentMon.moves[actions[id]['id']].range == 'self') {
            if(selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc)) {
                if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } else {
                    if(currentOpponentMon.moves[actions[id]['id']].effects.length > 0) {

                    } else {

                    }
                } 
            }
        } else if (currentOpponentMon.moves[actions[id]['id']].range == 'all') {
            if(selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc)) {
                if(targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc, playerMods.eva)) {

                }
            }
        } else {
            if(targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc, playerMods.eva)) {
                if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } else {
                    if(currentOpponentMon.moves[actions[id]['id']].effects.length > 0) {

                    } else {

                    }
                }
            }
        }
    }
}

function selfHit(acc, accMod) {
    let chance = Math.random();
    let accuracy = (parseInt(acc) + parseInt(accMod)) / 100;
    if(chance <= accuracy) {
        return true;
    } else {
        actionQueue.push({
            method: 'text',
            txt: "It fails..."
        });
        return false;
    }
}

function targetHit(acc, accMod, eva) {
    let chance = Math.random();
    let accuracy = (parseInt(acc) + parseInt(accMod) - parseInt(eva)) / 100;
    if(chance <= accuracy) {
        return true;
    } else {
        actionQueue.push({
            method: 'text',
            txt: "It misses..."
        });
        return false;
    }
}

function damageEffects() {
    /*
    will use this for 
    combo, vary, and multi effects
    */
}

function parseEffects(eff, atkMon, atkMods, defMon, defMods) {
    for(let i = 0; i < eff.length; i++) {
        let e = eff[i].split('-');
        switch(e[0]) {
            case "burn":
                if(e[1] == 'target') {
                    // will need to check for type immunity for some of these...
                    statusEffect('burn', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('burn', atkMon, e[2])
                }
                break;
            case "daze":
                if(e[1] == 'target') {
                    statusEffect('daze', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('daze', atkMon, e[2])
                }
                break;
            case "dec":
                break;
            case "heal":
                break;
            case "inc": 
                break;
            case "persist":
                break;
            case "poison":
                if(e[1] == 'target') {
                    statusEffect('poison', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('poison', atkMon, e[2])
                }
                break;
            case "recoil":
                break;
            case "recover":
                break;
            case "remove":
                break;
            case "sick":
                if(e[1] == 'target') {
                    statusEffect('sick', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('sick', atkMon, e[2])
                }
                break;
            case "sleep":
                if(e[1] == 'target') {
                    statusEffect('sick', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('sick', atkMon, e[2])
                }
                break;
            case "steal":
                break;
            case "stun":
                if(e[1] == 'target') {
                    statusEffect('stun', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('stun', atkMon, e[2])
                }
                break;
            case "wet":
                if(e[1] == 'target') {
                    statusEffect('wet', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('wet', atkMon, e[2])
                }
                break;
            case "wound":
                if(e[1] == 'target') {
                    statusEffect('wound', defMon, e[2])
                } else if(e[1] == 'self') {
                    statusEffect('wound', atkMon, e[2])
                }
                break;
            default:
                break;
        }
    }   
}

function statusEffect(status, target, prob) {
    let chance = Math.random();
    let decProb = parseInt(prob) / 100;
    if(chance <= decProb) {
        if(status == 'wet') {
            var str = target.name + " is " + status + "!";
        } else if(status == 'sick') {
            var str = target.name + " is " + status + "ened!";
        } else if(status == 'stun') {
            var str = target.name + " is " + status + "ned!";
        } else if(status == 'sleep') {
            var str = target.name + " fell a" + status + "!";
        } else if (status == 'daze') {
            var str = target.name + " is " + status + "d!";
        } else {
            var str = target.name + " is " + status + "ed!";
        }
        actionQueue.push({
            method: 'text',
            txt: str
        });
        actionQueue.push({
            method: 'status',
            id: status
        });
    }
}

function applyDamage(move, atkMon, defMon) {
    if(move.category == 'physical') {

    } else if (move.category == 'special') {

    }
}

function setPreBattleActionQueue() {

}