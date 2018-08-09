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
    $('#battle-util-div').fadeOut(() => {
        $('#battle-btns-div').show();
        $('#battle-util-div').fadeIn();
    });
}

function runActionQueue() {
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
        } else if (actionQueue[0].method == 'switch') {
            let switchMon = actionQueue.shift();
            switchIn(switchMon.target, switchMon.id);
        } else if (actionQueue[0].method == "must-switch") {
            console.log("must switch called in queue");
            $('#switch-mon-div').fadeIn(); 
        } else if(actionQueue[0].method == "end") {
            endBattle();
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
            console.log(actions[turn[i]].id);
            switchMon(turn[i], actions[turn[i]].id);
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
    if(checkFear(currentPlayerMon)) {
        actions.player.action = "shudder";
    }
    if(checkFear(currentOpponentMon)) {
        actions.opponent.action = "shudder";
    }
    for(let i = 0 ; i < turn.length; i++) {
        if (actions[turn[i]].action == "attack") {
            parseAttack(turn[i]);
        } else if(actions[turn[i]].action == "shudder") {
            shudder(turn[i]);
        }
    }
    runActionQueue();
}

function postBattlePhase() {
    phaseCounter++;
    for(let i = 0 ; i < turn.length; i++) {
        if (actions[turn[i]].action == "must-switch") {
            populateSwitch();
            $('#switch-mon-div').fadeIn();
        }
    }
    runActionQueue();
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

function checkFear(mon) {
    if(mon == currentPlayerMon) {
        if(mon.happiness < 50) {
            var threshold = mon.hp.max - (mon.hp.max * (mon.happiness / 100));
        } else {
            var threshold = 0;
        }
    } else {
        var threshold = mon.hp.max / 4;
    }

    if(mon.hp.current < threshold) {
        let chance = Math.random();
        if(chance < 0.5) {
            return true;
        }
    }
    return false;
}

function checkKO(mon, dmg) {
    if(parseInt(mon.hp.current) - dmg <= 0) {
        return true;
    }
    return false;
}
 
function checkMainStatus(target) {
    if(target == "player") {
        var mon = currentPlayerMon;
    } else if (target == "opponent") {
        var mon = currentOpponentMon;
    }
    for(let i = 0; i < mon.status.length; i++) {
        if(mon.status[i] == "sleep") {

        }
    }
}

function checkSpeed() {
    turn = [];
    let pSpeed = parseInt(currentPlayerMon.stats.speed) * playerMods.speed.value;
    let oSpeed = parseInt(currentOpponentMon.stats.speed) * opponentMods.speed.value;
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

function switchMon(target, id) {
    if(target == 'player') {
        if(currentPlayerMon.hp.current > 0) {
            actionQueue.push({
                method: "text",
                txt: currentPlayerMon.name + " come back!"
            });
            actionQueue.push({
                method: "switch",
                id: id,
                target: 'player'
            });
        } else {
            actionQueue.push({
                method: "switch",
                id: id,
                target: 'player'
            });
        }
    }
}

function switchIn(target, id) {
    if(target == 'player') {
        for(let i = 0; i < partyMons.length; i++) {
            if(partyMons[i].id == id) {
                currentPlayerMon = partyMons[i];
            }
        }
    }
    changeMon(target);
    actionQueue.push({
        method: "text",
        txt: currentPlayerMon.name + " go!"
    });
    nextAction();
}

function useItem(id) {

}

function shudder(id) {
    if(id == 'player') {
        actionQueue.push({
            method: 'text',
            txt: currentPlayerMon.name + " is too scared to fight!"
        });
    } else if(id == 'opponent') {
        actionQueue.push({
            method: 'text',
            txt: currentOpponentMon.name + " shudders with fear!"
        });
        $('#run-btn').html("Yield");
    }
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

function hasType(mon, type) {
    for(let i = 0; i < mon.type.length; i++) {
        if(mon.type[i] == type) {
            return true;
        }
    }
    return false;
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
                    if(!hasType(defMon, 'Fire')) {
                        statusEffect('burn', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be burnt."
                        });
                    }
                } else if(e[1] == 'self') {
                    if(!hasType(atkMon, 'Fire')) {
                        statusEffect('burn', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be burnt."
                        });
                    }
                }
                break;
            case "daze":
                if(e[1] == 'target') {
                    statusEffect('daze', defMon, e[2]);
                } else if(e[1] == 'self') {
                    statusEffect('daze', atkMon, e[2]);
                }
                break;
            case "dec":
                if(e[2] == 'target') {
                    decreaseMod(defMon, defMods, e[1], e[3]);
                } else if(e[2] == 'self') {
                    decreaseMod(atkMon, atkMods, e[1], e[3]);
                }
                break;
            case "heal":
                break;
            case "inc": 
                if(e[2] == 'target') {
                    increaseMod(defMon, defMods, e[1], e[3]);
                } else if(e[2] == 'self') {
                    increaseMod(atkMon, atkMods, e[1], e[3]);
                }
                break;
            case "persist":
                break;
            case "poison":
                if(e[1] == 'target') {
                    if(!hasType(defMon, 'Toxic')) {
                        statusEffect('poison', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be poisoned."
                        });
                    }
                } else if(e[1] == 'self') {
                    if(!hasType(atkMon, 'Toxic')) {
                        statusEffect('poison', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be poisoned."
                        });
                    }
                }
                break;
            case "recoil":
                recoil(atkMon, e[1]);
                break;
            case "recover":
                break;
            case "remove":
                break;
            case "sick":
                if(e[1] == 'target') {
                    statusEffect('sick', defMon, e[2]);
                } else if(e[1] == 'self') {
                    statusEffect('sick', atkMon, e[2]);
                }
                break;
            case "sleep":
                if(e[1] == 'target') {
                    if(!hasType(defMon, 'Mech')) {
                        statusEffect('sleep', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " does not sleep."
                        });
                    }
                } else if(e[1] == 'self') {
                    if(!hasType(atkMon, 'Mech')) {
                        statusEffect('sleep', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " does not sleep."
                        });
                    }
                }
                break;
            case "steal":
                break;
            case "stun":
                if(e[1] == 'target') {
                    statusEffect('stun', defMon, e[2]);
                } else if(e[1] == 'self') {
                    statusEffect('stun', atkMon, e[2]);
                }
                break;
            case "wet":
                if(e[1] == 'target') {
                    statusEffect('wet', defMon, e[2]);
                } else if(e[1] == 'self') {
                    statusEffect('wet', atkMon, e[2]);
                }
                break;
            case "wound":
                if(e[1] == 'target') {
                    if(!hasType(defMon, 'Spooky')) {
                        statusEffect('wound', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be wounded."
                        });
                    }
                } else if(e[1] == 'self') {
                    if(!hasType(atkMon, 'Spooky')) {
                        statusEffect('wound', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be wounded."
                        });
                    }
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
        mods[stat].value = 2 / (Math.abs(mods[stat].count) + 2);
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
        mods[stat].value = (mods[stat].count + 2) / 2;
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

function recoil(mon, amount) {
    let dmg = Math.round(mon.hp.max * (amount / 100));

    actionQueue.push({
        method: "damage",
        dmg: dmg,
        target: mon
    });
    actionQueue.push({
        method: "text",
        txt: mon.name + " took recoil damage.",
    });

    if(checkKO(mon, dmg)) {
        die(mon);
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
    console.log(newHp);
    if(newHp <= 0) {
        newHp = 0;
        var newWidth = 0;
    } else {
        var newWidth = Math.round(defMon.healthDisplay.w * (newHp / parseInt(defMon.hp.current)));
    }
    if(newHp > 0 && newWidth <= 0) {
        newWidth = 1;
    }
    defMon.hp.current = newHp;
    if(defMon.hp.current == 0) {
        die(defMon);
    }
    updatePartyMons();
    damageInterval = setInterval(() => {
        defMon.healthDisplay.w = lerp(defMon.healthDisplay.w, newWidth, 0.05);
        if(defMon.healthDisplay.w >= (newWidth - 0.2) && defMon.healthDisplay.w <= (newWidth + 0.2)) {
            clearInterval(damageInterval);
            nextAction();
        }
    }, 20);
}

function die(mon) {
    // will need some way to check if more actions need to be done
    // such as post hit effects (attacker is buffed, etc.)
    // instead of clearing the queue
    
    actionQueue.push({
        method: "text",
        txt: mon.name + " has been defeated!"
    });
    actionQueue = [];
    if(mon == currentPlayerMon) {
        if(hasMonsAvailable('player')) {
            mustSwitch = true;
            actionQueue.push({
                method: "must-switch",
            });
        } else {
            actionQueue.push({
                method: "text",
                txt: player.name + " is out of NuzMon!"
            });
            actionQueue.push({
                method: "text",
                txt: player.name + " blacked out!"
            });
            actionQueue.push({
                method: "end",
            });
        }
    } else {
        if(battleType === 'wild') {
            actionQueue.push({
                method: "end",
            });
        }
    }
}

function hasMonsAvailable(id) {
    if(id == 'player') {
        for(let i = 0; i < partyMons.length; i++) {
            if(partyMons[i].hp.current > 0) {
                return true;
            }
        }
    }
    return false;
}

function calculateExp(winMon, loseMon) {
    let delta = 0.8 * (Math.pow((parseInt(winMon.level) + 1), 2.5) - Math.pow(parseInt(winMon.level), 2.5));
    let factor = parseInt(loseMon.xp) * (loseMon.level / winMon.level);
    let gain = Math.round(((delta * factor) / inBattle.length) + 1);
    return gain;
}

function endBattle() {
    actionQueue = [];
    calculateExp(currentPlayerMon, currentOpponentMon);
    goToLocation();
    // will need to save info here
    console.log("battle ended");
}

