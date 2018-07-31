$(document).ready(function() {
    $('#move-btns').hide();
    $('.switch-mon-btn').each(function() {
        if ($(this).attr('data') == playerCurrentMon) {
            $(this).prop('disabled', true);
        }
    });
    populateMoves(playerCurrentMon);
});

function addBattleText(str) {
    roundSegs[segIndex] = { 'text': str };
    segIndex++;
}

function addBattleAction(action) {
    roundSegs[segIndex] = action;
    segIndex++;
}

function backtoMap() {
    var totalPlayerMons = 0;
    for(var keys in playerMons) {
        totalPlayerMons++;
    }
    $.post(updateMonsTrans, { playerMons: playerMons, count: totalPlayerMons }, function(data) {
        removeSection('#header');
        removeSection('#game-nav');
        removeSection('#game-foci');
        removeSection('#footer');
        insertHTML('#header', gHeaderComp, function() {
            insertHTML('#game-nav', navComp, function() {
                insertHTML('#game-foci', mapComp);
            });
        });
    });
}

function backToLocation() {
    var totalPlayerMons = 0;
    for(var keys in playerMons) {
        totalPlayerMons++;
    }
    $.post(updateMonsTrans, { playerMons: playerMons, count: totalPlayerMons }, function() {
        removeSection('#header');
        removeSection('#game-nav');
        removeSection('#game-foci');
        removeSection('#footer');
        $.post(locComp, { id: locId }, function(data) {
            $('#game-foci').append(data).hide().fadeIn('fast');
            insertHTML('#header', gHeaderComp, function() {
                insertHTML('#game-nav', navComp);
            });
        });
    });
}

function calculateDamage() {
    var base = atkMon['moves'][atkMonMove]['dmg'];
    if (atkMon['moves'][atkMonMove]['special'] == 1) {
        var a = parseInt(atkMon['sAtk']) + parseInt(atkMonMods['sAtk']['mod']);
        var d = parseInt(defMon['sDef']) + parseInt(defMonMods['sDef']['mod']);
    } else {
        var a = parseInt(atkMon['atk']) + parseInt(atkMonMods['atk']['mod']);
        var d = parseInt(defMon['def']) + parseInt(defMonMods['def']['mod']);
    }

    var roundDmg = Math.round(base * (a / d));
    if (roundDmg < 1) {
        roundDmg = 1;
    }
    roundDmg *= checkType(atkMon, defMon);
    if (roundDmg < 1) {
        roundDmg = 1;
    }
    if (checkStab(atkMon, atkMonMove)) {
        roundDmg *= 1.5;
        roundDmg = Math.round(roundDmg);
    }
    return roundDmg;
}

function checkAttackerStatus() {
    if(checkForStatus(atkMon['status'], 'sleep')) {
        var chance = Math.random();
        if(chance >= .5) {
            wakeUp(atkMon);
            parseMove();
        } else {
            addBattleText(atkMon['name'] + " is sleeping!");
            playSegments();
        }
    } else if(checkForStatus(atkMon['status'], 'stun')) {
        addBattleText(atkMon['name'] + " is stunned!");
    } else {
        parseMove();
    }
}

function checkCrit() {
    var crit = atkMon['moves'][atkMonMove]['crit']
    crit += atkMonMods['crit']['mod'];
    var chance = Math.floor(Math.random() * 100) + 1;
    if (chance <= crit) {
        return true;
    }
    return false;
}

function checkHit() {
    var chance = Math.floor(Math.random() * 100) + 1;
    var acc = parseInt(atkMon['moves'][atkMonMove]['acc']);
    acc += parseInt(atkMonMods['acc']['mod']);
    acc -= parseInt(defMonMods['evasion']['mod']);
    if (acc > 100) {
        acc = 100;
    } else if (acc < 1) {
        acc = 1;
    }
    return (chance <= acc) ? true : false;
}

function checkMonsAvailable() {
    var totalPlayerMons = 0;
    for(var key in playerMons) {
        totalPlayerMons++;
    } 
    for (i = 1; i <= totalPlayerMons; i++) {
        if (playerMons[i]['alive'] == 1) {
            return true;
        }
    }
    return false;
}

function checkStab() {
    if (atkMon['type1'] == atkMon['moves'][atkMonMove]['type']) {
        return true;
    } else if (atkMon['type2'] == atkMon['moves'][atkMonMove]['type']) {
        return true;
    }
    return false;
}

function checkType() {
    // will return the amount dmg should be multiplied

    return 1;
}

function clearSegment() {
    roundSegs = {};
    segIndex = 0;
    clearInterval(segInterval);
}

function declareAttacker() {
    if(turn == 'player'){
        atkMon = playerMons[playerCurrentMon];
        atkMonMove = playerMoveId;
        atkMonMods = playerMods;
        atkMonHealth = $('#player-health');
        atkMonStatus = $('#player-status');
        defMon = opponentMons[opponentCurrentMon];
        defMonMove = opponentMoveId;
        defMonMods = opponentMods;
        defMonHealth = $('#opponent-health');
        defMonStatus = $('#opponent-status');
    } else if(turn == 'opponent') {
        atkMon = opponentMons[opponentCurrentMon];
        atkMonMove = opponentMoveId;
        atkMonMods = opponentMods;
        atkMonHealth = $('#opponent-health');
        atkMonStatus = $('#opponent-status');
        defMon = playerMons[playerCurrentMon];
        defMonMove = playerMoveId;
        defMonMods = playerMods;
        defMonHealth = $('#player-health');
        defMonStatus = $('#player-status');
    }
}

function determineOpponentAction() {
    // will add additional opponent AI behaviors here
    if (opponentAI == 'random') {
        randomMoveSelect(opponentMons[opponentCurrentMon]['moves']);
    }
}

function getIntervalFromString(str) {
    return (str.length * 50) + 1000;
}

function itemView() {
    $('#battle-main').fadeOut('fast');
    $('#battle-footer').fadeOut('fast', function() {
        $('#mon-select').hide();
        $('#game-nav').fadeIn('fast', function() {
            $('#item-select').show();
            $('#battle-util').fadeIn('fast');
        });
    });
}

function movePriorityCheck() {
    var opponentPriority = priorityCheck(opponentMons[opponentCurrentMon]['moves'][opponentMoveId]);
    var playerPriority = priorityCheck(playerMons[playerCurrentMon]['moves'][playerMoveId]);
    if (playerPriority > opponentPriority) {
        turn = 'player'
    } else if (opponentPriority > playerPriority) {
        turn = 'opponent';
    }
}

function nuzMonView() {
    $('#battle-main').fadeOut('fast');
    $('#battle-footer').fadeOut('fast', function() {
        $('#item-select').hide();
        $('#game-nav').fadeIn('fast', function() {
            $('#mon-select').show();
            $('#battle-util').fadeIn('fast');
        });
    });
}

function populateMoves(id) {
    $('#move1-btn').html(playerMons[id]['moves']['1']['name']);
    if (playerMons[id]['moves']['2']) {
        $('#move2-btn').html(playerMons[id]['moves']['2']['name']);
        $('#move2-btn').prop("disabled", false);
    } else {
        $('#move2-btn').html('~');
        $('#move2-btn').prop("disabled", true);
    }
    if (playerMons[id]['moves']['3']) {
        $('#move3-btn').html(playerMons[id]['moves']['3']['name']);
        $('#move3-btn').prop("disabled", false);
    } else {
        $('#move3-btn').html('~');
        $('#move3-btn').prop("disabled", true);
    }
    if (playerMons[id]['moves']['4']) {
        $('#move4-btn').html(playerMons[id]['moves']['4']['name']);
        $('#move4-btn').prop("disabled", false);
    } else {
        $('#move4-btn').html('~');
        $('#move4-btn').prop("disabled", true);
    }
}

function priorityCheck(move) {
    if (move['e1'] != '') {
        var e = move['e1'].split('-');
        if (e[0] == 'priority') {
            return e[1];
        }
    }
    if (move['e2'] != '') {
        var e = move['e2'].split('-');
        if (e[0] == 'priority') {
            return e[1];
        }
    }
    if (move['e3'] != '') {
        var e = move['e3'].split('-');
        if (e[0] == 'priority') {
            return e[1];
        }
    }
    return 0;
}

function resetAnimation(element) {
    element.removeClass();
    var newElem = element.clone(false);
    element.replaceWith(newElem);
    return newElem;
}

function resetMods(mod) {
    mod['atk']['mod'] = 0;
    mod['atk']['count'] = 0;
    mod['def']['mod'] = 0;
    mod['def']['count'] = 0;
    mod['sAtk']['mod'] = 0;
    mod['sAtk']['count'] = 0;
    mod['sDef']['mod'] = 0;
    mod['sDef']['count'] = 0;
    mod['speed']['mod'] = 0;
    mod['speed']['count'] = 0;
    mod['acc']['mod'] = 0;
    mod['acc']['count'] = 0;
    mod['crit']['mod'] = 0;
    mod['crit']['count'] = 0;
    mod['evasion']['mod'] = 0;
    mod['evasion']['count'] = 0;
}

function showBattleText() {
    $('#battle-btns').hide();
    $('#move-btns').fadeOut("fast", function() {
        $('#game-nav').fadeOut('fast', function() {
            $('#battle-main').fadeIn('fast');
            $('#battle-footer').fadeIn('fast', function() {
                $('#battle-text').html("");
                $('#battle-text').fadeIn("fast");
            });
        });
    });
}

function speedCheck() {
    var playerSpeed = parseInt(playerMons[playerCurrentMon]['speed']) + parseInt(playerMods['speed']['mod']);
    var opponentSpeed = parseInt(opponentMons[opponentCurrentMon]['speed']) + parseInt(opponentMods['speed']['mod']);
    if (playerSpeed > opponentSpeed) {
        turn = 'player';
    } else if (opponentSpeed > playerSpeed) {
        turn = 'opponent';
    } else if (playerSpeed == opponentSpeed) {
        var rand = Math.floor(Math.random() * 2);
        if (rand == 0) {
            turn = 'player';
        } else if (rand == 1) {
            turn = 'opponent';
        }
    }
}

function switchPlayerMons(callback) {
    $('#player-health').attr('aria-valuenow', playerMons[playerCurrentMon]['currentHp']);
    $('#player-health').attr('aria-valuemax', playerMons[playerCurrentMon]['maxHp']);

    var pHealth = Math.round((playerMons[playerCurrentMon]['currentHp'] / playerMons[playerCurrentMon]['maxHp']) * 100);
    $('#player-health').css('width', pHealth + '%');
    $('#player-img').attr('src', "img/mons/" + playerMons[playerCurrentMon]['img']);
    $('#player-name').html(playerMons[playerCurrentMon]['name']);
    var status = playerMons[playerCurrentMon]['status'];
    $('#player-status').html(status.toUpperCase());
    populateMoves(playerCurrentMon);
    $('.switch-mon-btn').each(function() {
        if ($(this).attr('data') == playerCurrentMon) {
            $(this).prop('disabled', true);
        } else {
            $(this).prop('disabled', false);
        }
    });
    if (callback) {
        callback();
    }
}

function switchTurn() {
    if (turn == 'player') {
        turn = 'opponent';
        declareAttacker();
    } else if (turn == 'opponent') {
        turn = 'player';
        declareAttacker();
    }
}

function updateItemView(data) {

}

function updateMonView() {
    $("#" + playerCurrentMon + "-hp").html(playerMons[playerCurrentMon]['currentHp'] + "/" + playerMons[playerCurrentMon]['maxHp'])
}

function whoGoesFirst() {
    if (playerAction == 'attack') {
        if (opponentAction == 'attack') {
            speedCheck();
            movePriorityCheck();
        } else if (opponentAction == 'switch' || opponentAction == 'item') {
            turn = 'opponent';
        }
    }
    if (playerAction == 'switch' || playerAction == 'item') {
        if (opponentAction == 'attack') {
            turn = 'player';
        } else if (opponentAction == 'switch' || opponentAction == 'item') {
            speedCheck();
        }
    }
}