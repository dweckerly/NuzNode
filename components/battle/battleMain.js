function startFight() {
    mustSwitch = false;
    if (currentOpponentMon.ai == "random") {
        randomMoveSelect();
    }
    round();
}

function round() {
    actionQueue = [];
    phaseCounter++;
    console.log(phases[phaseCounter]);
    if (phases[phaseCounter] == 'pre') {
        preBattlePhase();
    } else if (phases[phaseCounter] == 'main') {
        mainBattlePhase();
    } else if (phases[phaseCounter] == 'post') {
        postBattlePhase();
    } else if(phases[phaseCounter] == 'trans'){
        transitionPhase();
    }
    if (phaseCounter >= 5) {
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
    if (actionQueue[0].method == "text") {
        let str = actionQueue.shift();
        if('style' in str) {
            showBattleText(str.txt, str.style);
        } else {
            showBattleText(str.txt);
        }
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
        populateSwitch();
        $('#switch-mon-div').fadeIn();
    } else if (actionQueue[0].method == "end") {
        endBattle();
    } else if (actionQueue[0].method == 'xp') {
        console.log("xp called");
        let exp = actionQueue.shift();
        giveXp(exp.winMon, exp.loseMon);
    }
}

function nextTurn() {
    turnCount++;
    if (turnCount > 1) {
        turnCount = 0;
        round();
    } else {
        switch (phases[phaseCounter]) {
            case 'pre':
                preBattlePhase();
                break;
            case 'main':
                mainBattlePhase();
                break;
            case 'post':
                postBattlePhase();
                break;
            case 'trans':
                transitionPhase();
                break;
            default:
                round();
                break;
        }
    }
}

function preBattlePhase() {
    if (turnCount == 0) {
        checkSpeed();
    }
    if (actions[turn[turnCount]].action == "switch") {
        switchMon(turn[turnCount], actions[turn[turnCount]].id);
        actions[turn[turnCount]].action = "";
    } else if (actions[turn[turnCount]].action == "catch") {
        useItem(turn[turnCount]);
    }
    nextAction();
}

function mainBattlePhase() {
    if (turnCount == 0) {
        checkSpeed();
    }
    if (actions.player.action == "attack" && actions.opponent.action == "attack") {
        checkPriority();
    }
    if (checkFear(currentPlayerMon)) {
        actions.player.action = "shudder";
    }
    checkMainStatus(turn[turnCount]);
    if (checkFear(currentOpponentMon)) {
        actions.opponent.action = "shudder";
    }
    if (actions[turn[turnCount]].action == "attack") {
        parseAttack(turn[turnCount]);
    } else if (actions[turn[turnCount]].action == "shudder") {
        shudder(turn[turnCount]);
    } else if (actions[turn[turnCount]].action == "daze") {
        cantMove(turn[turnCount], 'daze');
    } else if (actions[turn[turnCount]].action == "sick") {
        cantMove(turn[turnCount], 'sick');
    } else if (actions[turn[turnCount]].action == "sleep") {
        cantMove(turn[turnCount], 'sleep');
    } else if (actions[turn[turnCount]].action == "stun") {
        cantMove(turn[turnCount], 'stun');
    }
    nextAction();
}

function postBattlePhase() {
    console.log(actions[turn[turnCount]]);
    if (turnCount == 0) {
        checkSpeed();
    }
    checkPostStatus(turn[turnCount]);
    nextAction();
}

function transitionPhase() {
    console.log(actions[turn[turnCount]]);
    if (actions[turn[turnCount]].action == "switch") {
        actionQueue.push({
            method: "switch",
            id: actions[turn[turnCount]].id,
            target: turn[turnCount]
        });
    }
    nextAction();
}

function showBattleText(txt, style) {
    $('#battle-text').removeClass('shake');
    $('#battle-text').removeClass('mute-text');
    if(style) {
        $('#battle-text').addClass(style);
    }
    typeWriter('battle-text', txt);
    var time = (txt.length * 50) + 1000;
    textInterval = setInterval(() => {
        clearInterval(textInterval);
        $('#battle-text').html("");
        nextAction();
    }, time);
}

function nextAction() {
    if (actionQueue.length > 0) {
        runActionQueue();
    } else {
        nextTurn();
    }
}

function checkFear(mon) {
    if (mon == currentPlayerMon) {
        if (mon.happiness < 50) {
            var threshold = mon.hp.max - (mon.hp.max * (mon.happiness / 100));
        } else {
            var threshold = 0;
        }
    } else {
        var threshold = mon.hp.max / 4;
    }

    if (mon.hp.current < threshold) {
        let chance = Math.random();
        if (chance < 0.25) {
            return true;
        }
    }
    return false;
}

function checkKO(mon, dmg) {
    if (parseInt(mon.hp.current) - dmg <= 0) {
        return true;
    }
    return false;
}

function checkMainStatus(target) {
    if (target == "player") {
        var mon = currentPlayerMon;
    } else if (target == "opponent") {
        var mon = currentOpponentMon;
    }
    for (let i = 0; i < mon.status.length; i++) {
        if (mon.status[i] == "daze") {
            // will need a way for a target to not be dazed consecutively
            if (statusCounter[target].daze.count == 0) {
                statusCounter[target].daze.count++;
                actions[target].action = "daze";
            } else if (statusCounter[target].daze.count >= statusCounter[target].daze.max) {
                removeStatus(mon, "daze");
            }
        }
        if (mon.status[i] == "sick") {
            let chance = Math.random();
            if (chance > 0.5) {
                actions[target].action = "sick";
            }
        }
        if (mon.status[i] == "sleep") {
            if (statusCounter[target].sleep.count >= statusCounter[target].sleep.max) {
                removeStatus(mon, "sleep");
            } else {
                let chance = Math.random();
                if (chance > 0.5) {
                    statusCounter[target].sleep.count++;
                    actions[target].action = "sleep";
                } else {
                    removeStatus(mon, 'sleep');
                }
            }
        }
        if (mon.status[i] == "stun") {
            if (statusCounter[target].stun.count >= statusCounter[target].stun.max) {
                removeStatus(mon, "stun");
            } else {
                let chance = Math.random();
                console.log(chance);
                if (chance > 0.5) {
                    statusCounter[target].stun.count++;
                    actions[target].action = "stun";
                } else {
                    removeStatus(mon, 'stun');
                }
            }
        }
    }
}

function checkPostStatus(target) {
    var woundCount = 0;
    if(target == 'player') {
        var mon = currentPlayerMon;
    } else if (target == 'opponent') {
        var mon = currentOpponentMon;
    }
    if(mon.hp.current > 0) {
        for (let i = 0; i < mon.status.length; i++) {
            if (mon.status[i] == "burn") {
                applyPostStatus(mon, 'burn', 0.0625);
            } else if (mon.status[i] == 'poison') {
                applyPostStatus(mon, 'poison', 0.125);
            } else if (mon.status[i] == 'wound') {
                woundCount++;
            }
        }
        if(woundCount > 0) {
            if(woundCount >= 3) {
                woundCount = 4;
            }
            applyPostStatus(mon, 'wound', (woundCount / 16));
        }
    }
}

function applyPostStatus(mon, eff, amount) {
    actionQueue.push({
        method: "text",
        txt: mon.name + " is hurt by the " + eff + "."
    });
    let dmg = Math.round(parseInt(mon.hp.max) * amount); 
    actionQueue.push({
        method: "damage",
        dmg: dmg,
        target: mon
    });
}

function checkSpeed() {
    var statusMod = {
        player: statusMods(currentPlayerMon),
        opponent: statusMods(currentOpponentMon)
    }
    turn = [];
    let pSpeed = parseInt(currentPlayerMon.stats.speed) * playerMods.speed.value * statusMod.player.speed;
    let oSpeed = parseInt(currentOpponentMon.stats.speed) * opponentMods.speed.value *  statusMod.opponent.speed;
    if (pSpeed > oSpeed) {
        turn = ["player", "opponent"];
    } else if (oSpeed > pSpeed) {
        turn = ["opponent", "player"];
    } else if (pSpeed == oSpeed) {
        let chance = Math.random();
        if (chance >= 0.5) {
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

    for (let i = 0; i < oEff.length; i++) {
        if (oEff[i].includes("priority")) {
            let p = oEff[i].split('-');
            oP = p[1];
        }
    }
    for (let i = 0; i < pEff.length; i++) {
        if (pEff[i].includes("priority")) {
            let p = pEff[i].split('-');
            pP = p[1];
        }
    }

    if (oP > pP) {
        turn = ["opponent", "player"];
    } else if (pP > oP) {
        turn = ["player", "opponent"];
    }
}

function switchMon(target, id) {
    if (target == 'player') {
        if (currentPlayerMon.hp.current > 0) {
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
    if (target == 'player') {
        for (let i = 0; i < partyMons.length; i++) {
            if (partyMons[i].id == id) {
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
    if (id == 'player') {
        actionQueue.push({
            method: 'text',
            txt: currentPlayerMon.name + " is too scared to fight!"
        });
    } else if (id == 'opponent') {
        actionQueue.push({
            method: 'text',
            txt: currentOpponentMon.name + " shudders with fear!"
        });
        $('#run-btn').html("Yield");
    }
}

function parseAttack(id) {
    if (id == 'player') {
        actionQueue.push({
            method: 'text',
            txt: currentPlayerMon.name + " uses " + currentPlayerMon.moves[actions[id]['id']].name + "!"
        });
        if (currentPlayerMon.moves[actions[id]['id']].range == 'self') {
            if (selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value)) {
                if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                } else {
                    calculateDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                }
            }
        } else if (currentPlayerMon.moves[actions[id]['id']].range == 'all') {
            if (selfHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value)) {
                if (targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value, opponentMods.eva.value)) {
                    if (currentPlayerMon.moves[actions[id]['id']].category == 'status') {
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    } else {
                        calculateDamage(currentPlayerMon.moves[actions[id]['id']], currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                        parseEffects(currentPlayerMon.moves[actions[id]['id']].effects, currentPlayerMon, playerMods, currentOpponentMon, opponentMods);
                    }
                }
            }
        } else {
            if (targetHit(currentPlayerMon.moves[actions[id]['id']].acc, playerMods.acc.value, opponentMods.eva.value)) {
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
        if (currentOpponentMon.moves[actions[id]['id']].range == 'self') {
            if (selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value)) {
                if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                } else {
                    calculateDamage(currentOpponentMon.moves[actions[id]['id']], currentOpponentMon, opponentMods, currentPlayerMon, playerMods)
                    parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                }
            }
        } else if (currentOpponentMon.moves[actions[id]['id']].range == 'all') {
            if (selfHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value)) {
                if (targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value, playerMods.eva.value)) {
                    if (currentOpponentMon.moves[actions[id]['id']].category == 'status') {
                        parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                    } else {
                        calculateDamage(currentOpponentMon.moves[actions[id]['id']], currentOpponentMon, opponentMods, currentPlayerMon, playerMods)
                        parseEffects(currentOpponentMon.moves[actions[id]['id']].effects, currentOpponentMon, opponentMods, currentPlayerMon, playerMods);
                    }
                }
            }
        } else {
            if (targetHit(currentOpponentMon.moves[actions[id]['id']].acc, opponentMods.acc.value, playerMods.eva.value)) {
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
    let accuracy = (parseInt(acc) / 100) + parseFloat(accMod);
    console.log(accuracy);
    if (chance <= accuracy) {
        return true;
    } else {
        actionQueue.push({
            method: 'text',
            txt: "It fails...",
            style: "mute-text"
        });
        return false;
    }
}

function targetHit(acc, accMod, eva) {
    let chance = Math.random();
    let accuracy = (parseInt(acc) / 100) + (parseFloat(accMod) - parseFloat(eva));
    console.log(accuracy);
    if (chance <= accuracy) {
        return true;
    } else {
        actionQueue.push({
            method: 'text',
            txt: "It misses...",
            style: "mute-text"
        });
        return false;
    }
}

function hasType(mon, type) {
    for (let i = 0; i < mon.type.length; i++) {
        if (mon.type[i] == type) {
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
    for (let i = 0; i < eff.length; i++) {
        let e = eff[i].split('-');
        switch (e[0]) {
            case "burn":
                if (e[1] == 'target') {
                    if (!hasType(defMon, 'Fire')) {
                        statusEffect('burn', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be burnt.",
                            style: "mute-text"
                        });
                    }
                } else if (e[1] == 'self') {
                    if (!hasType(atkMon, 'Fire')) {
                        statusEffect('burn', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be burnt.",
                            style: "mute-text"
                        });
                    }
                }
                break;
            case "daze":
                if (e[1] == 'target') {
                    statusEffect('daze', defMon, e[2]);
                } else if (e[1] == 'self') {
                    statusEffect('daze', atkMon, e[2]);
                }
                break;
            case "dec":
                if (e[2] == 'target') {
                    decreaseMod(defMon, defMods, e[1], e[3]);
                } else if (e[2] == 'self') {
                    decreaseMod(atkMon, atkMods, e[1], e[3]);
                }
                break;
            case "heal":
                removeStatus(atkMon, e[1]);
                break;
            case "inc":
                if (e[2] == 'target') {
                    increaseMod(defMon, defMods, e[1], e[3]);
                } else if (e[2] == 'self') {
                    increaseMod(atkMon, atkMods, e[1], e[3]);
                }
                break;
            case "poison":
                if (e[1] == 'target') {
                    if (!hasType(defMon, 'Toxic')) {
                        statusEffect('poison', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be poisoned.",
                            style: "mute-text"
                        });
                    }
                } else if (e[1] == 'self') {
                    if (!hasType(atkMon, 'Toxic')) {
                        statusEffect('poison', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be poisoned.",
                            style: "mute-text"
                        });
                    }
                }
                break;
            case "recoil":
                recoil(atkMon, e[1]);
                break;
            case "recover":
                if(e[1] == 'self') {
                    calculateRecover(atkMon, e[2]);
                } else if(e[1] == 'target') {
                    calculateRecover(defMon, e[2]);
                }
                break;
            case "remove":
                if(e[1] == 'mod') {
                    if(e[2] == 'all') {
                        resetMods('player');
                        resetMods('opponent');
                        actionQueue.push({
                            method: "text",
                            txt: "All status changes have been removed!"
                        });
                    }
                }
                break;
            case "sick":
                if (e[1] == 'target') {
                    statusEffect('sick', defMon, e[2]);
                } else if (e[1] == 'self') {
                    statusEffect('sick', atkMon, e[2]);
                }
                break;
            case "sleep":
                if (e[1] == 'target') {
                    if (!hasType(defMon, 'Mech')) {
                        statusEffect('sleep', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " does not sleep.",
                            style: "mute-text"
                        });
                    }
                } else if (e[1] == 'self') {
                    if (!hasType(atkMon, 'Mech')) {
                        statusEffect('sleep', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " does not sleep.",
                            style: "mute-text"
                        });
                    }
                }
                break;
            case "steal":
                if(e[1] == 'mod') {
                    copyMods(defMods, atkMods, e[2]);
                }
                break;
            case "stun":
                if (e[1] == 'target') {
                    statusEffect('stun', defMon, e[2]);
                } else if (e[1] == 'self') {
                    statusEffect('stun', atkMon, e[2]);
                }
                break;
            case "wet":
                if (e[1] == 'target') {
                    statusEffect('wet', defMon, e[2]);
                } else if (e[1] == 'self') {
                    statusEffect('wet', atkMon, e[2]);
                }
                break;
            case "wound":
                if (e[1] == 'target') {
                    if (!hasType(defMon, 'Spooky')) {
                        statusEffect('wound', defMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: defMon.name + " cannot be wounded.",
                            style: "mute-text"
                        });
                    }
                } else if (e[1] == 'self') {
                    if (!hasType(atkMon, 'Spooky')) {
                        statusEffect('wound', atkMon, e[2]);
                    } else {
                        actionQueue.push({
                            method: "text",
                            txt: atkMon.name + " cannot be wounded.",
                            style: "mute-text"
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
    if (!hasStatus(target, status)) {
        if(target.status.length < 3) {
            let chance = Math.random();
            let decProb = parseInt(prob) / 100;
            if (chance <= decProb) {
                if (status == 'wet') {
                    var str = target.name + " is " + status + "!";
                } else if (status == 'sick') {
                    var str = target.name + " is " + status + "ened!";
                } else if (status == 'stun') {
                    var str = target.name + " is " + status + "ned!";
                } else if (status == 'sleep') {
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
        } else {
            actionQueue.push({
                method: 'text',
                txt: target.name + " resists the " + status + "."
            });
        }
    } else {
        if (status == 'wet' || status == 'sick') {
            var str = target.name + " is already " + status + ".";
        } else if (status == 'stun') {
            var str = target.name + " is already " + status + "ned.";
        } else if (status == 'sleep') {
            var str = target.name + " is already a" + status + ".";
        } else {
            var str = target.name + " is already " + status + "ed.";
        }
        actionQueue.push({
            method: 'text',
            txt: str,
            style: "mute-text"
        });
    }
}

function removeStatus(mon, status) {
    if (mon == currentPlayerMon) {
        var target = 'player';
    } else if (mon == currentOpponentMon) {
        var target = 'opponent';
    }
    if(status == 'all') {
        if(mon.status.length != 0) {
            mon.status = [];
            actionQueue.push({
                method: "text",
                txt: mon.name + " completely healed!"
            });
        }
        actionQueue.push({
            method: 'status',
            id: "",
            target: mon
        });
    } else {
        for (let i = 0; i < mon.status.length; i++) {
            if (mon.status[i] == status) {
                mon.status.splice(i, 1);
                statusCounter[target][status].count = 0;
                if (status == "daze") {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " is no longer dazed!"
                    });
                } else if (status == "sick") {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " feels better!"
                    });
                } else if (status == 'sleep') {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " woke up!"
                    });
                } else if (status == "stun") {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " is no longer stunned!"
                    });
                } else if (status == "wet") {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " dried off!"
                    });
                } else {
                    actionQueue.push({
                        method: "text",
                        txt: mon.name + " is no longer " + status + "ed!"
                    });
                }
                actionQueue.push({
                    method: 'status',
                    id: "",
                    target: mon
                });
            }
        }
    }
}

function hasStatus(target, status) {
    for (let i = 0; i < target.status.length; i++) {
        if (target.status[i] == status) {
            return true;
        }
    }
    return false;
}

function showStatusChange(target) {
    if (target == currentPlayerMon) {
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
    if (mods[stat].count > -5) {
        if (parseInt(mods[stat].count) - parseInt(amount) < -5) {
            amount = parseInt(mods[stat].count) - (-5);
        }
        mods[stat].count -= parseInt(amount);
        mods[stat].value = 2 / (Math.abs(mods[stat].count) + 2);
        if (amount == 1) {
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
    if (mods[stat].count < 5) {
        if (parseInt(mods[stat].count) + parseInt(amount) > 5) {
            amount = 5 - parseInt(mods[stat].count);
        }
        mods[stat].count += parseInt(amount);
        mods[stat].value = (mods[stat].count + 2) / 2;
        if (amount == 1) {
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
    if (checkKO(mon, dmg)) {
        die(mon);
    }
}

function calculateDamage(move, atkMon, atkMods, defMon, defMods) {
    var statusMod = {
        atkMon: statusMods(atkMon),
        defMon: statusMods(defMon)
    }
    var lvl = parseInt(atkMon.level);
    var base = parseInt(move.dmg);
    if (move.category == 'physical') {
        var a = parseInt(atkMon.stats.atk) * parseFloat(atkMods.atk.value) * statusMod.atkMon.atk;
        var d = parseInt(defMon.stats.def) * parseFloat(defMods.def.value) * statusMod.defMon.def;
    } else if (move.category == 'special') {
        var a = parseInt(atkMon.stats.sAtk) * parseFloat(atkMods.sAtk.value) * statusMod.atkMon.sAtk;
        var d = parseInt(defMon.stats.sDef) * parseFloat(defMods.sDef.value) * statusMod.defMon.sDef;
    }
    var dmgMod = damageMod(move, atkMon, defMon);
    var dmg = Math.round(((((((2 * lvl) / 5) + 2) * base * (a / d)) / 50) + 2) * dmgMod);
    if (dmg < 1) {
        dmg = 1;
    }
    actionQueue.push({
        method: "damage",
        dmg: dmg,
        target: defMon
    });
    if(move.range == 'contact') {
        if(hasStatus(defMon, 'sleep')) {
            removeStatus(defMon, 'sleep');
        }
    }
    if(move.type == 'Fire') {
        if((move.range != 'self') && hasStatus(defMon, 'wet')) {
            removeStatus(defMon, 'wet');
        }
    }
}

function calculateRecover(mon, amount) {
    let rec = Math.round(parseInt(mon.hp.max) * (parseInt(amount) / 100));
    if((parseInt(mon.hp.current) + rec) > parseInt(mon.hp.max)) {
        rec = parseInt(mon.hp.max) - parseInt(mon.hp.current);
    }
    if(rec > 0) {
        actionQueue.push({
            method: "text",
            txt: mon.name + " recovered health!",
        });
    } else {
        actionQueue.push({
            method: "text",
            txt: mon.name + " is already at full health."
        });
    }
    actionQueue.push({
        method: "damage",
        dmg: -(rec),
        target: mon
    });
}

function damageMod(move, atkMon, defMon) {
    let mod = 1;
    let stab = checkStab(atkMon, move);
    for (let i = 0; i < defMon.type.length; i++) {
        mod *= typeCheck(move.type, defMon.type[i]);
    }
    mod *= statusTypeCheck(move.type, defMon);
    if (mod > 1) {
        actionQueue.push({
            method: "text",
            txt: defMon.name + " is devastated!",
            style: 'shake'
        });
    } else if (mod < 1) {
        actionQueue.push({
            method: "text",
            txt: defMon.name + " resists.",
            style: "mute-text"
        });
    }
    return mod * stab;
}

function showDamage(dmg, defMon) {
    var newHp = parseInt(defMon.hp.current) - dmg;
    if (newHp <= 0) {
        newHp = 0;
        var newWidth = 0;
    } else {
        var newWidth = Math.round(defMon.healthDisplay.w * (newHp / parseInt(defMon.hp.current)));
    }
    if (newHp > 0 && newWidth <= 0) {
        newWidth = 1;
    }
    if(newHp > defMon.hp.max) {
        newHp = defMon.hp.max;
    }
    if(newWidth > playerHealthRect.w) {
        newWidth = playerHealthRect.w;
    }

    defMon.hp.current = newHp;
    if (defMon.hp.current == 0) {
        die(defMon);
    }
    updatePartyMons();
    damageInterval = setInterval(() => {
        defMon.healthDisplay.w = lerp(defMon.healthDisplay.w, newWidth, 0.05);
        if (defMon.healthDisplay.w >= (newWidth - 0.2) && defMon.healthDisplay.w <= (newWidth + 0.2)) {
            clearInterval(damageInterval);
            nextAction();
        }
    }, 20);
}

function die(mon) {
    actionQueue.push({
        method: "text",
        txt: mon.name + " was defeated!"
    });
    if (mon == currentPlayerMon) {
        for (let i = 0; i < inBattle.length; i++) {
            if (inBattle[i] == currentPlayerMon) {
                inBattle.splice(i, 1);
            }
        }
        actions.player.action = "switch";
        if (hasMonsAvailable('player')) {
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
        actionQueue.push({
            method: 'xp',
            winMon: currentPlayerMon,
            loseMon: currentOpponentMon
        });
    }
}

function hasMonsAvailable(id) {
    if (id == 'player') {
        for (let i = 0; i < partyMons.length; i++) {
            if (partyMons[i].hp.current > 0) {
                return true;
            }
        }
    }
    return false;
}

function giveXp(winMon, loseMon) {
    for (let i = 0; i < inBattle.length; i++) {
        let xp = calculateExp(inBattle[i], loseMon);
        actionQueue.push({
            method: "text",
            txt: inBattle[i].name + " gained " + xp + " XP!"
        });
        if (checkLevelUp(winMon, xp)) {
            actionQueue.push({
                method: "text",
                txt: inBattle[i].name + " leveled up!"
            });
            actionQueue.push({
                method: "levelup",
                target: inBattle[i]
            });
        }
    }
    if (battleType === 'wild') {
        actionQueue.push({
            method: "end",
        });
    }
    nextAction();
}

function checkLevelUp(mon, xp) {
    if (parseInt(mon.exp.current) + xp >= parseInt(mon.exp.next)) {
        console.log("lvl up true");
        return true;
    }
    console.log("lvl up false");
    return false;
}

function calculateExp(winMon, loseMon) {
    if(battleType == 'wild') {
        var a = 1;
    } else {
        var a = 1.5;
    }
    let baseXp = calculateBaseXp(loseMon);
    let delta = (Math.pow(2 * parseInt(loseMon.level), 2.5) / Math.pow(parseInt(winMon.level) + parseInt(loseMon.level), 2.5));
    let factor = baseXp * (parseInt(loseMon.level) / parseInt(winMon.level));
    let gain = Math.round((((delta * factor) / inBattle.length) + 1) * a);
    return gain;
}

function endBattle() {
    actionQueue = [];
    goToLocation();
    // will need to save info here
    console.log("battle ended");
}