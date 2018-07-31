$('.move-btn').click(function() {
    var id = $(this).attr('data');
    playerMoveId = id;
    playerAction = 'attack';
    preBattlePhase();
});

$('.switch-mon-btn').click(function() {
    $('#back-util').prop('disabled', false);
    var id = $(this).attr('data');
    playerSwicthMonId = id;
    playerAction = 'switch';
    if(rounds >= 2) {
        switchMon();
    } else {
        preBattlePhase();
    }
});

$('.item-btn').click(function() {
    var id = $(this).attr('data');
    var iName = $(this).attr('data-name');
    var effect = $(this).attr('data-effect');
    var itemData = {
        'id': id,
        'name': iName,
        'effect': effect
    }
    playerUseItem = itemData;
    playerAction = 'item';
    preBattlePhase();
});

function preBattlePhase() {
    showBattleText();
    if (type == 'wild' || type == 'npc') {
        determineOpponentAction();
        startRound();
    }
    /// else { POST action and listen/check for opponent action }
}

function startRound() {
    whoGoesFirst();
    declareAttacker();
    round();
}

function round(action) {
    rounds++;
    if(turn == 'player') {
        var action = playerAction;
    } else if(turn == 'opponent') {
        var action = opponentAction;
    }
    switch(action) {
        case 'attack':
            checkAttackerStatus();
            break;
        case 'item':
            useItem();
            break;
        case 'switch':
            switchMon();
            break;
        default:
            break;
    }
}

function parseMove() {
    declareAttacker();
    addBattleText(atkMon['name'] + " used " + atkMon['moves'][atkMonMove]['name'] + "!");
    if (checkHit()) {
        if (atkMon['moves'][atkMonMove]['dmg'] > 0 && atkMon['moves'][atkMonMove]['e1'].indexOf('multi') == -1) {
            var dmg = calculateDamage();
            addBattleAction({'damage-enemy': dmg});
        }
        parseEffect();
    } else {
        if (atkMon['moves'][atkMonMove]['dmg'] > 0) {
            addBattleText("It missed...");
        } else {
            addBattleText("It failed...");
        }
    }
    playSegments();
}

function endRound() {
    rounds = 0;
    clearSegment();
    $('#battle-text').fadeOut('fast', function() {
        $('#battle-btns').fadeIn("fast");
    });
}

function playSegments() {
    var i = 0;
    console.log(roundSegs);
    segments = setInterval(function() {
        if (roundSegs[i]) {
            console.log(rounds);
            if ('text' in roundSegs[i]) {
                typeWriter(roundSegs[i]['text'], "battle-text");
            } else if ('apply-effect' in roundSegs[i]) {
                typeWriter(roundSegs[i]['apply-effect']['text'], "battle-text");
                updateStatusDisplay(roundSegs[i]['apply-effect']['mon']);
            } else if ('damage-self' in roundSegs[i]) {
                applyDamage(roundSegs[i]['damage-self'], atkMon, atkMonHealth);
            } else if ('damage-enemy' in roundSegs[i]) {
                applyDamage(roundSegs[i]['damage-enemy'], defMon, defMonHealth);
            } else if ('animation-enemy' in roundSegs[i]) {
                if (turn == 'player') {
                    var el = $('#opponent-img');
                } else if (turn == 'opponent') {
                    var el = $('#player-img');
                    var player = true;
                }
                el = resetAnimation(el);
                if (player) {
                    el.addClass("flip-img battle-img " + roundSegs[i]['animation-enemy']);
                } else {
                    el.addClass("battle-img " + roundSegs[i]['animation-enemy']);
                }
            } else if ('animation-self' in roundSegs[i]) {
                if (turn == 'player') {
                    var el = $('#player-img');
                    var player = true;
                } else if (turn == 'opponent') {
                    var el = $('#opponent-img');
                }
                el = resetAnimation(el);
                if (player) {
                    el.addClass("flip-img battle-img " + roundSegs[i]['animation-self']);
                } else {
                    el.addClass("battle-img " + roundSegs[i]['animation-self']);
                }
            } else if ('heal-self' in roundSegs[i]) {
                applyHeal(roundSegs[i]['heal-self'], atkMon, atkMonHealth);
            } else if ('heal-enemy' in roundSegs[i]) {
                applyHeal(roundSegs[i]['heal-enemy'], defMon, defMonHealth);
            } else if ('die-enemy' in roundSegs[i]) {
                if (turn == 'player') {
                    $('#opponent-img-div').animate({ opacity: 0 });;
                    $('#opponent-info-div').animate({ opacity: 0 });
                } else if (turn == 'opponent') {
                    $('#player-img-div').animate({ opacity: 0 });
                    $('#player-info-div').animate({ opacity: 0 });
                }
            } else if ('die-self' in roundSegs[i]) {
                if (turn == 'player') {
                    $('#player-img-div').animate({ opacity: 0 });
                    $('#player-info-div').animate({ opacity: 0 });
                } else if (turn == 'enemy') {
                    ('#opponent-img-div').animate({ opacity: 0 });
                    $('#opponent-info-div').animate({ opacity: 0 });
                }
            } else if ('switch-mon' in roundSegs[i]) {
                if (roundSegs[i]['switch-mon'] == 'in') {
                    switchPlayerMons(function() {
                        $('#player-info-div').animate({ opacity: 1 });
                        $('#player-img-div').animate({ opacity: 1 });
                    });
                } else if (roundSegs[i]['switch-mon'] == 'out') {
                    $('#player-info-div').animate({ opacity: 0 });
                    $('#player-img-div').animate({ opacity: 0 });
                    resetMods(playerMods);
                }
            } else if ('select-mon' in roundSegs[i]) {
                if (roundSegs[i]['select-mon'] == 'player') {
                    nuzMonView();
                }
            } else if ('escape' in roundSegs[i]) {
                typeWriter(roundSegs[i]['escape'], "battle-text");
            }
            i++;
        } else {
            clearInterval(segments);
            if (endFight) {
                endBattle();
            } else if(rounds >= 2) {
                console.log("ending round");
                endRound();
            } else {
                clearSegment();
                switchTurn();
                round();
            }
        }
    }, segInterval);
}

function die(mon) {
    if (mon == atkMon) {
        addBattleAction({ 'die-self': 'die' });
        addBattleText(atkMon['name'] + " was defeated!");
    } else if (mon == defMon) {
        addBattleAction({ 'die-enemy': 'die' });
        addBattleText(defMon['name'] + " was defeated!");
    }

    if (mon == playerMons[playerCurrentMon]) {
        playerMons[playerCurrentMon]['alive'] = 0;
        $('.switch-mon-btn').each(function() {
            if ($(this).attr('data') == playerCurrentMon) {
                $(this).remove();
            }
        });
        if (checkMonsAvailable()) {
            $('#back-util').prop('disabled', true);
            addBattleAction({ "select-mon": "player" });
        } else {
            addBattleText("You're out of NuzMon!");
            endFight = true;
            win = false;
        }
    } else if (mon == opponentMons[opponentCurrentMon]) {
        endFight = true;
        win = true;
    }
}

function endBattle() {
    clearSegment();
    if (win) {
        backToLocation();
    } else {
        backtoMap();
    }
}

function applyDamage(amount, mon, health) {
    mon['currentHp'] -= amount;
    var hPercent = Math.round((mon['currentHp'] / mon['maxHp']) * 100);
    if (mon['currentHp'] <= 0) {
        mon['currentHp'] = 0;
        die(mon);
    } else {
        if (hPercent <= 0) {
            hPercent = 1;
        }
    }
    health.attr('aria-valuenow', mon['currentHp']);
    health.css('width', hPercent + '%');
    updateMonView();
    if (mon['status'].includes("sleep")) {
        wakeUp(mon, turn);
    }
}

function applyHeal(amount, mon, health) {
    var recover = Math.round(mon['maxHp'] * (parseInt(amount) / 100));
    if ((parseInt(mon['currentHp']) + parseInt(recover)) > mon['maxHp']) {
        mon['currentHp'] = mon['maxHp'];
    } else {
        var hp = parseInt(mon['currentHp']) + parseInt(recover);
        mon['currentHp'] = hp;
    }
    var hPercent = Math.round((mon['currentHp'] / mon['maxHp']) * 100);
    health.attr('aria-valuenow', mon['currentHp']);
    health.css('width', hPercent + '%');
    updateMonView();
}

function switchMon() {
    if (turn == 'player') {
        if (playerMons[playerCurrentMon]['alive'] == 1) {
            addBattleText(playerMons[playerCurrentMon]['name'] + " come back!");
            addBattleAction({ 'switch-mon': 'out' });
        }
        playerCurrentMon = playerSwicthMonId;
        addBattleText(playerMons[playerCurrentMon]['name'] + ", go!");
        addBattleAction({ 'switch-mon': 'in' });
    } else if (turn == 'opponent') {
        if (opponentMons[opponentCurrentMon]['alive'] == 1) {
            addBattleText(opponentMons[opponentCurrentMon]['name'] + " come back!");
            addBattleAction({ 'switch-mon': 'out' });
        }
        opponentCurrentMon = opponentSwitchMonId;
        addBattleText(opponentMons[opponentCurrentMon]['name'] + ", go!");
        addBattleAction({ 'switch-mon': 'in' });
    }
    playSegments();
}

function useItem() {
    $.post(useItemTrans, { id: playerUseItem['id'] }, function(data) {
        updateItemView(data);
    });
    addBattleText('You use the ' + playerUseItem['name'] + '!');
    var ef = playerUseItem['effect'].split('-');
    if (ef[0] == 'catch') {
        catchMon(ef[1]);
    }
    playSegments();
}

function catchMon(r) {
    var rate = ((((opponentMons[opponentCurrentMon]['currentHp'] / opponentMons[opponentCurrentMon]['maxHp']) * 100) - 100) * (-1));
    rate += parseInt(r);
    var rand = Math.floor(Math.random() * 100) + 1;
    if (rand <= rate) {
        addBattleText('You caught ' + opponentMons[opponentCurrentMon]['name'] + '!');
        $.post(catchMonTrans, { wildMon: opponentMons[opponentCurrentMon] }, function(data) {
            addBattleText(data);
        });
        endFight = true;
        win = true;
    } else {
        addBattleAction({ 'escape': opponentMons[opponentCurrentMon]['name'] + ' escaped!' });
    }
}