function updatePartyMons() {
    for (let i = 0; i < partyMons.length; i++) {
        if (partyMons[i].id == currentPlayerMon.id) {
            partyMons[i] = currentPlayerMon;
        }
    }
    if (battleType == "trainer") {
        for (let i = 0; i < opponentMons.length; i++) {
            if (opponentMons[i].id == currentOpponentMon.id) {
                opponentMons[i] = currentopponentMon;
            }
        }
    }
}

function populateSwitch() {
    $('#switch-content').html("");
    if (!mustSwitch) {
        $('#switch-content').append("<span class='switch-close'>&times;</span>");
        $('.switch-close').click(() => {
            $('#switch-mon-div').fadeOut();
        });
    }
    if ($('#switch-close').length) {
        if (mustSwitch) {
            $('#switch-close').remove();
        }
    }

    for (let i = 0; i < partyMons.length; i++) {
        if (partyMons[i] == currentPlayerMon) {
            $('#switch-content').append(`
            <div class='mon-container-current' id='` + partyMons[i].id + `'> 
                <img width='128' height='128' src='` + partyMons[i].img + `'>
                <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
            </div>
            `);
        } else {
            if (partyMons[i].hp.current > 0) {
                $('#switch-content').append(`
                <div class='mon-container available'>
                    <img width='64' height='64' src='` + partyMons[i].img + `'>
                    <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
                    <div class="switch-btn-div">
                        <button class="switch-in-btn" data='` + partyMons[i].id + `'>Switch In!</button>
                    </div>
                </div>
                `);
            } else {
                $('#switch-content').append(`
                <div class='mon-container'>
                    <img width='64' height='64' src='` + partyMons[i].img + `'>
                    <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
                </div>
                `);
            }

        }
    }

    var switchBtns = document.getElementsByClassName("switch-in-btn");
    for (let i = 0; i < switchBtns.length; i++) {
        switchBtns[i].addEventListener("click", function() {
            let id = $(this).attr('data');
            $('#switch-mon-div').fadeOut(() => {
                actions.player.action = "switch";
                actions.player.id = id;
                if (!mustSwitch) {
                    endSelectPhase();
                } else {
                    round();
                }
            });
        });
    }
}

function endSelectPhase() {
    $('#fight-btns-div').fadeOut(() => {
        $('#battle-util-div').fadeIn();
        $('#battle-btns-div').hide();
        startFight();
    });
}

function copyMods(sourceMods, destMods, mod) {
    if(mod == 'all') {
        destMods = sourceMods;
        actionQueue.push({
            method: "text",
            txt: atkMon.name + " copied all " + defMon.name + "'s stat changes!"
        });
    } else {
        destMods[mod] = sourceMods[mod];
        actionQueue.push({
            method: "text",
            txt: atkMon.name + " copied " + defMon.name + "'s " + mod.toUpperCase() + " changes!"
        });
    }
}

function resetMods(target) {
    if (target == 'player') {
        playerMods = {
            atk: { value: 1, count: 0 },
            def: { value: 1, count: 0 },
            sAtk: { value: 1, count: 0 },
            sDef: { value: 1, count: 0 },
            speed: { value: 1, count: 0 },
            acc: { value: 1, count: 0 },
            eva: { value: 1, count: 0 },
            crit: { value: 1, count: 0 }
        }
    } else if (target == 'opponent') {
        opponentMods = {
            atk: { value: 1, count: 0 },
            def: { value: 1, count: 0 },
            sAtk: { value: 1, count: 0 },
            sDef: { value: 1, count: 0 },
            speed: { value: 1, count: 0 },
            acc: { value: 1, count: 0 },
            eva: { value: 1, count: 0 },
            crit: { value: 1, count: 0 }
        }
    }
}

function changeMon(target) {
    resetMods(target)
    if (target == 'player') {
        playerNameTxt.txt = currentPlayerMon['name'];
        playerMonLvl = currentPlayerMon['level'];
        pLvlTxt = "lvl. " + playerMonLvl
        $('#player-img').attr('src', currentPlayerMon.img);
        playerStatusTxt = createStatusString(currentPlayerMon);
        currentPlayerMon['healthDisplay'] = playerHealthOverlay;
        let per = currentPlayerMon.hp.current / currentPlayerMon.hp.max;
        playerHealthOverlay.w = playerHealthRect.w * per;
        populateMoveBtns();
        inBattle.push(currentPlayerMon);
    } else if (target == 'opponent') {

    }
}

function populateMoveBtns() {
    $('#atk-1').html(currentPlayerMon['moves']['1']['name']);
    $('#atk-1').attr('data', 1);
    if ("2" in currentPlayerMon['moves']) {
        $('#atk-2').html(currentPlayerMon['moves']['2']['name']);
        $('#atk-2').attr('data', 2);
        $('#atk-2').prop("disabled", false);
        if ('3' in currentPlayerMon['moves']) {
            $('#atk-3').html(currentPlayerMon['moves']['3']['name']);
            $('#atk-3').attr('data', 3);
            $('#atk-3').prop("disabled", false);
            if ('4' in currentPlayerMon['moves']) {
                $('#atk-4').html(currentPlayerMon['moves']['4']['name']);
                $('#atk-4').attr('data', 4);
                $('#atk-4').prop("disabled", false);
            } else {
                $('#atk-4').prop("disabled", true);
                $('#atk-4').html("-");
            }
        } else {
            $('#atk-3').prop("disabled", true);
            $('#atk-3').html("-");
            $('#atk-4').prop("disabled", true);
            $('#atk-4').html("-");
        }
    } else {
        $('#atk-2').prop("disabled", true);
        $('#atk-2').html("-");
        $('#atk-3').prop("disabled", true);
        $('#atk-3').html("-");
        $('#atk-4').prop("disabled", true);
        $('#atk-4').html("-");
    }
}

function typeCheck(atkType, defType) {
    if (atkType == 'Plant') {
        if (defType == 'Water') {
            return 2;
        } else if (defType == 'Stone') {
            return 2;
        } else if (defType == 'Bug') {
            return 0.5;
        } else if (defType == 'Fire') {
            return 0.5
        }
    } else if (atkType == 'Fire') {
        if (defType == 'Plant') {
            return 2;
        } else if (defType == 'Mech') {
            return 2;
        } else if (defType == 'Fire') {
            return 0;
        } else if (defType == 'Water') {
            return 0.5;
        } else if (defType == 'Stone') {
            return 0.5;
        }
    } else if (atkType == 'Water') {
        if (defType == 'Fire') {
            return 2;
        } else if (defType == 'Stone') {
            return 2;
        } else if (defType == 'Plant') {
            return 0.5;
        } else if (defType == 'Water') {
            return 0.5;
        }
    } else if (atkType == 'Bug') {
        if (defType == 'Plant') {
            return 2;
        } else if (defType == 'Shady') {
            return 2;
        } else if (defType == 'Mech') {
            return 0.5;
        } else if (defType == 'Stone') {
            return 0.5;
        }
    } else if (atkType == 'Electric') {
        if (defType == 'Water') {
            return 2;
        } else if (defType == 'Mech') {
            return 2;
        } else if (defType == 'Electric') {
            return 0;
        } else if (defType == 'Stone') {
            return 0.5;
        } else if (defType == 'Plant') {
            return 0.5;
        }
    }
    return 1;
}

function checkStab(mon, move) {
    for (let i = 0; i < mon.type.length; i++) {
        if (move.type == mon.type[i]) {
            return 1.25;
        }
    }
    return 1;
}

function statusMods(mon) {
    let mod = {
        atk: 1,
        def: 1,
        sAtk: 1,
        sDef: 1,
        speed: 1,
        acc: 1,
        eva: 1
    };
    for (let i = 0; i < mon.status.length; i++) {
        if (mon.status[i] == 'burn') {
            mod.def *= 0.5;
        } else if (mon.status[i] == 'sick') {
            mod.atk *= 0.5;
            mod.sAtk *= 0.5;
        } else if (mon.status[i] == 'sleep') {
            mod.sDef *= 0.5;
            mod.eva *= 0.5;
        } else if (mon.status[i] == 'stun') {
            mod.speed *= 0.5;
            mod.eva *= 0.5;
        } else if (mon.status[i] == 'wet') {
            
        }
    }
    return mod;
}

function statusTypeCheck(type, mon) {
    if(hasStatus(mon, 'wet')) {
        if(type == 'Electric') {
            return 2;
        } else if (type == 'Fire') {
            return 0.5;
        }
    } else if (hasStatus(mon, 'sleep')) {
        if(type == 'Spooky') {
            return 2;
        }
    }
    return 1;
}

function cantMove(target, eff) {
    if (target == 'player') {
        var mon = currentPlayerMon;
    } else if (target == 'opponent') {
        var mon = currentOpponentMon;
    }
    if (eff == 'daze') {
        actionQueue.push({
            method: "text",
            txt: mon.name + " is seeing stars!"
        });
    } else if (eff == 'sick') {
        actionQueue.push({
            method: "text",
            txt: mon.name + " is wretching uncontrollably!"
        });
    } else if (eff == 'sleep') {
        actionQueue.push({
            method: "text",
            txt: mon.name + " is fast asleep..."
        });
    } else if (eff == 'stun') {
        actionQueue.push({
            method: "text",
            txt: mon.name + " is completely stunned!"
        });
    }
}

function calculateBaseXp(mon) {
    let statTot = parseInt(mon.stats.atk) + parseInt(mon.stats.def) + parseInt(mon.stats.sAtk) + parseInt(mon.stats.sDef) + parseInt(mon.stats.speed);
    let genTot = parseInt(mon.genetics.hp) + parseInt(mon.genetics.atk) + parseInt(mon.genetics.def) + parseInt(mon.genetics.sAtk) + parseInt(mon.genetics.sDef) + parseInt(mon.genetics.speed);
    let genFactor = genTot / 77;
    return (statTot / 3) * genFactor;
}

function getMoveUpdate(mid, lvl) {
    let movePoolData = JSON.parse(fs.readFileSync('data/movePools.json', 'utf8'));
    for(let i = 0; i < movePoolData[mid].level.length; i++) {
        if(movePoolData[mid].level[i] == lvl) {
            let moveId = movePoolData[mid].id[i];
            let moveData = JSON.parse(fs.readFileSync('data/moves.json', 'utf8'));
            let move = moveData[moveId];
            return move;
        }
    }
    return null;
}