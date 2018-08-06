function startFight() {
    if(currentOpponentMon.ai == "random") {
        randomMoveSelect();
    }
    round();
}

function round() {
    actionQueue = [];
    console.log(phases[phaseCounter]);
    if(phases[phaseCounter] == 'pre') {
        preBattlePhase();
    } else if (phases[phaseCounter] == 'main') {
        mainBattlePhase();
    } else if (phases[phaseCounter] == 'post') {
        postBattlePhase();
    }
    if(phaseCounter >= 4) {
        phaseCounter = 0;
        endRound();
    }
}

function endRound() {
    console.log("end");
    $('#battle-util-div').fadeOut(() => {
        $('#battle-btns-div').show();
        $('#battle-util-div').fadeIn();
    });
}

function runActionQueue() {
    console.log(actionQueue);
    if(actionQueue.length > 0) {
        if(actionQueue[0].method == "text") {
            let str = actionQueue.shift();
            showBattleText(str.txt);
        } else if (actionQueue[0].method == "damage") {
            let damage = actionQueue.shift();
            showDamage(damage.dmg, damage.target);
        } else if (actionQueue[0].method == "status") {
            let status = actionQueue.shift();
            showStatusChange(status.target);
        }
    } else {
        round();
    }
}

function preBattlePhase() {
    phaseCounter++;
    checkSpeed();
    for(let i = 0; i < turn.length; i++) {
        if (actions[turn[i]].action == "switch") {
            switchMon(turn[i]);
        } else if (actions[turn[i]].action == "catch") {
            useItem(turn[i]);
        }
    }
    runActionQueue();
}

function mainBattlePhase() {
    phaseCounter++;
    checkSpeed();
    if(actions.player.action == "attack" && actions.opponent.action == "attack") {
        checkPriority();
    }
    for(let i = 0 ; i < turn.length; i++) {
        if (actions[turn[i]].action == "attack") {
            parseAttack(turn[i]);
        }
    }
    runActionQueue();
}

function postBattlePhase() {
    phaseCounter++;
    round();
}

function showBattleText(txt) {
    typeWriter('battle-text', txt);
    var time = (txt.length * 50) + 1000;
    textInterval = setInterval(() => {
        clearInterval(textInterval);
        $('#battle-text').html("");
        nextAction();
    }, time);
}

function nextAction() {
    if(actionQueue.length > 0) {
        runActionQueue();
    } else {
        round();
    }
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
    var pEff = currentPlayerMon.moves[actions.player.id].effects;
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
            if(selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value)) {
                if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                } else {
                    calculateDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                }
            }
        } else if (currentPlayerMon.moves[actions[id]['id']].range == 'all') {
            if(selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value)) {
                if(targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value, opponentMods.eva.value)) {
                    if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    } else {
                        calculateDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    }
                }
            }
        } else {
            if(targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value, opponentMods.eva.value)) {
                if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                } else {
                    calculateDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                }
            }
        }
    } else if (id == 'opponent') {
        actionQueue.push({
            method: 'text',
            txt: currentOpponentMon.name + " uses " + currentOpponentMon.moves[actions[id]['id']].name + "!"
        });
        if(currentOpponentMon.moves[actions[id]['id']].range == 'self') {
            if(selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value)) {
                if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } else {
                    calculateDamage(currentOpponentMon.moves[actions[id]['id']], currentOpponentMon, opponentMods, currentPlayerMon, playerMods)
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } 
            }
        } else if (currentOpponentMon.moves[actions[id]['id']].range == 'all') {
            if(selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value)) {
                if(targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value, playerMods.eva.value)) {
                    if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                        parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                    } else {
                        calculateDamage(currentOpponentMon.moves[actions[id]['id']], currentOpponentMon, opponentMods, currentPlayerMon, playerMods)
                        parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                    }
                }
            }
        } else {
            if(targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value, playerMods.eva.value)) {
                if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } else {
                    calculateDamage(currentOpponentMon.moves[actions[id]['id']], currentOpponentMon, opponentMods, currentPlayerMon, playerMods)
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                }
            }
        }
    }
}

function selfHit(acc, accMod) {
    let chance = Math.random();
    let accuracy = (parseInt(acc) * parseInt(accMod)) / 100;
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
    let accuracy = (parseInt(acc) * parseInt(accMod)) / 100;
    accuracy *= (2 - parseInt(eva)); 
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
                if(e[2] == 'target') {
                    decreaseMod(defMon, defMods, e[1], e[3])
                } else if(e[2] == 'self') {
                    decreaseMod(atkMon, atkMods, e[1], e[3])
                }
                break;
            case "heal":
                break;
            case "inc": 
                if(e[2] == 'target') {
                    increaseMod(defMon, defMods, e[1], e[3])
                } else if(e[2] == 'self') {
                    increaseMod(atkMon, atkMods, e[1], e[3])
                }
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
    // will need to check if mon already has status...
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
        target.status.push(status);
        actionQueue.push({
            method: 'text',
            txt: str
        });
        actionQueue.push({
            method: 'status',
            id: status,
            target: target
        });
    }
}

function showStatusChange(target) {
    if(target == currentPlayerMon) {
        playerStatus.txt = createStatusString(currentPlayerMon);
    } else {
        opponentStatus.txt = createStatusString(currentOpponentMon);
    }
    statusInterval = setInterval(() => {
        clearInterval(statusInterval);
        nextAction();
    }, 500);
}

function decreaseMod(target, mods, stat, amount) {
    if(mods[stat].count > -5) {
        if(parseInt(mods[stat].count) - parseInt(amount) < -5) {
            amount = parseInt(mods[stat].count) - (-5);
        } 
        mods[stat].count -= parseInt(amount);
        mods[stat].value -= 0.2 * parseInt(amount);
        if(amount == 1) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " decreased!",
            });
        } else if (amount == 2) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " decreased greatly!",
            });
        } else if (amount == 3) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " drastically decreased!",
            });
        }
    } else {
        actionQueue.push({
            method: "text",
            txt: target.name + "'s " + stat.toUpperCase() + " can't go any lower!",
        });
    }
}


function increaseMod(target, mods, stat, amount) {
    if(mods[stat].count < 5) {
        if(parseInt(mods[stat].count) + parseInt(amount) > 5) {
            amount = 5 - parseInt(mods[stat].count);
        } 
        mods[stat].count += parseInt(amount);
        mods[stat].value += 0.2 * parseInt(amount);
        if(amount == 1) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " increased!",
            });
        } else if (amount == 2) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " increased greatly!",
            });
        } else if (amount == 3) {
            actionQueue.push({
                method: "text",
                txt: target.name + "'s " + stat.toUpperCase() + " drastically increased!",
            });
        }
    } else {
        actionQueue.push({
            method: "text",
            txt: target.name + "'s " + stat.toUpperCase() + " can't go any higher!",
        });
    }
}

function calculateDamage(move, atkMon, atkMods, defMon, defMods) {
    var lvl = parseInt(atkMon.level);
    var base = parseInt(move.dmg);
    if(move.category == 'physical') {
        var a = parseInt(atkMon.stats.atk) * parseInt(atkMods.atk.value);
        var d = parseInt(defMon.stats.def) * parseInt(defMods.def.value);
    } else if (move.category == 'special') {
        var a = parseInt(atkMon.stats.sAtk) * parseInt(atkMods.sAtk.value);
        var d = parseInt(defMon.stats.sDef) * parseInt(defMods.sDef.value);
    }
    var dmgMod = damageMod(move, atkMon, defMon);
    var dmg = Math.round(((((((2 * lvl) / 5) + 2) * base * (a / d)) / 50) + 2) * dmgMod);
    if(dmg < 1) {
        dmg = 1;
    }
    actionQueue.push({
        method: "damage",
        dmg: dmg,
        target: defMon
    });
}

function damageMod(move, atkMon, defMon) {
    return 1;
}

function showDamage(dmg, defMon) {
    var newHp = parseInt(defMon.hp.current) - dmg;
    if(newHp < 0) {
        newHp = 0;
        die(defMon);
    }
    var newWidth = Math.round(defMon.healthDisplay.w * (newHp / parseInt(defMon.hp.current)));
    if(newHp > 0 && newWidth <= 0) {
        newWidth = 1;
    }
    defMon.hp.current = newHp;
    damageInterval = setInterval(() => {
        defMon.healthDisplay.w = lerp(defMon.healthDisplay.w, newWidth, 0.05);
        if(defMon.healthDisplay.w >= (newWidth - 0.2) && defMon.healthDisplay.w <= (newWidth + 0.2)) {
            clearInterval(damageInterval);
            nextAction();
        }
    }, 20);
}

function die(mon) {
    actionQueue = [];
    actionQueue.push({
        method: "text",
        txt: mon.name + " has been defeated!"
    });
    if(mon == currentPlayerMon) {

    } else {
        if(battleType === 'wild') {
            calculateExp(currentPlayerMon, currentOpponentMon);
            endBattle();
        }
    }
}

function calculateExp(winMon, loseMon) {

}

function endBattle() {
    // will need to save info here
    console.log("battle ended");
}

function randomMoveSelect() {
    actions.opponent.action = "attack";
    actions.opponent.id = (Math.floor(Math.random() * Object.keys(currentOpponentMon.moves).length) + 1);
}