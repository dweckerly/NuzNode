var sleepRounds = 0;

function parseEffect() {
    var e1 = atkMon['moves'][atkMonMove]['e1'];
    var e2 = atkMon['moves'][atkMonMove]['e2'];
    var e3 = atkMon['moves'][atkMonMove]['e3'];
    var effects = [e1, e2, e3];
    effects.forEach(e => {
        if (e) {
            var p = e.split('-');
            switch (p[0]) {
                case 'burn':
                    statusEffect(p[1], p[2], 'burn');
                    break;
                case 'decrease':
                    decreaseStat(p[1], p[2], parseInt(p[3]));
                    break;
                case 'increase':
                    increaseStat(p[1], p[2], parseInt(p[3]));
                    break;
                case 'multi':
                    multi(p[1]);
                    break;
                case 'recoil':
                    recoil(p[1]);
                    break;
                case 'recover':
                    recover(p[1], p[2]);
                    break;
                case 'sleep':
                    statusEffect(p[1], p[2], 'sleep');
                    break;
                case 'stun':
                    statusEffect(p[1], p[2], 'stun');
                    break;
                case 'wet':
                    statusEffect(p[1], p[2], 'wet');
                    break;
                case 'wound':
                    statusEffect(p[1], p[2], 'wound');
                    break;
                default:
                    break;
            }
        }
    });
}

function statusEffect(target, chance, eff) {
    var prob = Math.floor(Math.random() * 100) + 1;
    if (prob <= chance) {
        if (target == 'self') {
            var status = $(atkMonStatus).html();
            if (checkForStatus(status, eff.toUpperCase())) {
                alreadyHasStatus(atkMon, eff);
            } else {
                addStatus(atkMon, eff);
            }
        } else if (target == 'target') {
            var status = $(defMonStatus).html();
            if (checkForStatus(status, eff.toUpperCase())) {
                alreadyHasStatus(defMon, eff);
            } else {
                addStatus(defMon, eff);
            }
        }
    }
}

function addStatus(mon, eff) {
    if (eff == 'wet') {
        addBattlAction({ 'apply-effect': { 'text': mon['name'] + " is " + eff + "!", 'mon': mon }});
    } else if (eff == 'sleep') {
        addBattleAction({ 'apply-effect': { 'text': mon['name'] + " fell a" + eff + "!", 'mon': mon }});
    } else if (eff == 'stun') {
        addBattleAction({ 'apply-effect': { 'text': mon['name'] + " is " + eff + "ned!", 'mon': mon } });
    } else {
        addBattleAction({ 'apply-effect': { 'text': mon['name'] + " is " + eff + "ed!", 'mon': mon } });
    }
    if (mon['status'] == '') {
        mon['status'] = eff;
    } else {
        mon['status'] = mon['status'] + '-' + eff;
    }
}

function alreadyHasStatus(mon, eff) {
    if (eff == 'wet' || eff == 'sleep') {
        addBattleText(mon['name'] + " is already a" + eff + "!");
    } else if (eff == 'stun') {
        addBattleText(mon['name'] + " is already " + eff + "ned!");
    } else {
        addBattleText(mon['name'] + " is already " + eff + "ed!");
    }
}

function checkForStatus(container, eff) {
    var pos = container.indexOf(eff);
    if (pos >= 0) {
        return true;
    }
    return false;
}

function decreaseStat(stat, target, amount) {
    if (amount == 1) {
        var flavor = " decreased!";
    } else if (amount == 2) {
        var flavor = " greatly decreased!";
    } else if (amount == 3) {
        var flavor = " drastically decreased!";
    }

    if (target == 'self') {
        if (atkMonMods[stat]['count'] > minModCount) {
            if ((atkMonMods[stat]['count'] - amount) >= minModCount) {
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    atkMonMods[stat]['mod'] -= (crtEvaAccMod * amount);
                } else {
                    atkMonMods[stat]['mod'] -= (Math.round(atkMon[stat] * mod)) * amount;
                }
                atkMonMods[stat]['count'] -= amount;
                addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + flavor);
            } else {
                var adjAmount = atkMonMods[stat]['count'] - minModCount;
                atkMonMods[stat]['count'] = minModCount;
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    atkMonMods[stat]['mod'] -= (crtEvaAccMod * adjAmount);
                } else {
                    atkMonMods[stat]['mod'] -= (Math.round(atkMon[stat] * mod)) * adjAmount;
                }
                addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + flavor);
            }

            if (turn == 'player') {
                playerMods = atkMonMods;
            } else if (turn == 'enemy') {
                enemyMods = atkMonMods
            }
        } else {
            addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + " can't go any lower!");
        }

    } else if (target == 'target') {
        if (defMonMods[stat]['count'] > minModCount) {
            if ((defMonMods[stat]['count'] - amount) >= minModCount) {
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    defMonMods[stat]['mod'] -= (crtEvaAccMod * amount);
                } else {
                    defMonMods[stat]['mod'] -= (Math.round(defMon[stat] * mod)) * amount;
                }
                defMonMods[stat]['count'] -= amount;
                addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + flavor);
            } else {
                var adjAmount = defMonMods[stat]['count'] - minModCount;
                defMonMods[stat]['count'] = minModCount;
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    defMonMods[stat]['mod'] -= (crtEvaAccMod * adjAmount);
                } else {
                    defMonMods[stat]['mod'] -= (Math.round(defMon[stat] * mod)) * adjAmount;
                }

                addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + flavor);
            }

            if (turn == 'player') {
                enemyMods = defMonMods;
            } else if (turn == 'enemy') {
                playerMods = defMonMods
            }
        } else {
            addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + " can't go any lower!");
        }
    }
}

function increaseStat(stat, target, amount) {
    if (amount == 1) {
        var flavor = " increased!";
    } else if (amount == 2) {
        var flavor = " greatly increased!";
    } else if (amount == 3) {
        var flavor = " drastically increased!";
    }

    if (target == 'self') {
        if (atkMonMods[stat]['count'] < maxModCount) {
            if ((atkMonMods[stat]['count'] - amount) <= maxModCount) {
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    atkMonMods[stat]['mod'] += (crtEvaAccMod * amount);
                } else {
                    atkMonMods[stat]['mod'] += (Math.round(atkMon[stat] * mod)) * amount;
                }
                atkMonMods[stat]['count'] += amount;
                addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + flavor);
            } else {
                var adjAmount = maxModCount - count;
                atkMonMods[stat]['count'] = maxModCount;
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    atkMonMods[stat]['mod'] += (crtEvaAccMod * adjAmount);
                } else {
                    atkMonMods[stat]['mod'] += (Math.round(atkMon[stat] * mod)) * adjAmount;
                }
                addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + flavor);
            }
            if (turn == 'player') {
                playerMods = atkMonMods;
            } else if (turn == 'enemy') {
                enemyMods = atkMonMods
            }
        } else {
            addBattleText(atkMon['name'] + "'s " + stat.toUpperCase() + " can't go any higher!");
        }
    } else if (target == 'target') {
        if (defMonMods[stat]['count'] < maxModCount) {
            if ((defMonMods[stat]['count'] - amount) <= maxModCount) {
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    defMonMods[stat]['mod'] += (crtEvaAccMod * amount);
                } else {
                    defMonMods[stat]['mod'] += (Math.round(defMon[stat] * mod)) * amount;
                }
                defMonMods[stat]['count'] += amount;
                addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + flavor);
            } else {
                var adjAmount = maxModCount - count;
                defMonMods[stat]['count'] = maxModCount;
                if (stat == 'evasion' || stat == 'crit' || stat == 'acc') {
                    defMonMods[stat]['mod'] += (crtEvaAccMod * adjAmount);
                } else {
                    defMonMods[stat]['mod'] += (Math.round(defMon[stat] * mod)) * adjAmount;
                }
                addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + flavor);
            }
            if (turn == 'player') {
                enemyMods = defMonMods;
            } else if (turn == 'enemy') {
                playerMods = defMonMods
            }
        } else {
            addBattleText(defMon['name'] + "'s " + stat.toUpperCase() + " can't go any higher!");
        }
    }
}

function multi(amount) {
    var hits = Math.round(Math.random() * amount) + 1;
    var dmg = calculateDamage();
    var i = 1;
    var count = 0;
    for (i; i <= hits; i++) {
        if (checkHit()) {
            count++;
            var dmg = calculateDamage();
            addBattleAction({'damage-enemy': dmg});
            if(count == 1) {
                addBattleText(atkMon['name'] + " hit 1 time!");
            } else {
                addBattleText(atkMon['name'] + " hit " + count + " times!");
            }
            if((defMon['currentHp'] - (dmg * count)) <= 0){
                break;
            } 
        } else {
            addBattleText('It missed...');
        }
    }
}

function recoil(amount) {
    addBattleText(atkMon['name'] + " took recoil damage.");
    var recoilDmg = Math.round(atkMon['maxHp'] * (amount / 100));
    addBattleAction({ 'damage-self': recoilDmg });
}

function recover(target, amount) {
    if (target == 'self') {
        if(atkMon['currentHp'] == atkMon['maxHp']) {
            addBattleText(atkMon['name'] + " is at full health!");
        } else {
            addBattleText(atkMon['name'] + " recovered health!");
            addBattleAction({ 'heal-self': amount });
        }
        
    } else {
        if(defMon['currentHp'] == defMon['maxHp']) {
            addBattleText(defMon['name'] + " is at full health!");
        } else {
            addBattleText(defMon['name'] + " recovered health!");
            addBattleAction({ 'heal-enemy': amount });
        }
    }
}

function removeStatus(mon, status) {
    var str = mon['status'].split('-');
    var nStr = "";
    str.forEach(function(s) {
        if (s != status) {
            nStr = nStr + s + '-'
        }
    });
    nStr = nStr.slice(0, -1);
    mon['status'] = nStr;
    updateStatusDisplay(mon);
}

function updateStatusDisplay(mon) {
    if (mon == playerMons[playerCurrentMon]) {
        var monStatus = playerMons[playerCurrentMon]['status'];
        $('#player-status').html(monStatus.toUpperCase());
    } else if (mon == opponentMons[opponentCurrentMon]) {
        var monStatus = opponentMons[opponentCurrentMon]['status'];
        $('#opponent-status').html(monStatus.toUpperCase());
    } else if (mon == opponentMons[opponentCurrentMon]) {
        var monStatus = opponentMons[opponentCurrentMon]['status']
        $('#opponent-status').html(monStatus.toUpperCase());
    }
}

function wakeUp(mon) {
    addBattleText(mon['name'] + ' woke up!');
    removeStatus(mon, 'sleep');
}