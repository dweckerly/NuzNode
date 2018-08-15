function verticalAlign(id) {
    var h = electron.remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().height;
    var elH = $('#' + id).height();
    var top = (h / 2) - (elH / 2);
    $('#' + id).css({
        "position": "absolute",
        "top": top.toString() + "px"
    });
}

function isHidden(el) {
    return (el.offsetParent === null)
}

function disableMenu() {
    if($('#nav-div').length) {
        $('#nav-main-btn').prop('disabled', true);
    }
}

function enableMenu() {
    if($('#nav-div').length) {
        $('#nav-main-btn').prop('disabled', false);
    }
}

function goToLocation() {
    if(!$('#nav-div').length) {
        addComponent('header', navComp);
    }
    if(player.location == 0) {
        changeSection('main', mapComp);
    } else {
        changeSection('main', locationComp);
    }
}

function clearIntervals() {
    clearInterval(main);
    clearInterval(sinAnim);
}


// component functions

function addComponent(id, component) {
    var data = fs.readFileSync(component);
    $('#' + id).html(data.toString()).hide().fadeIn();
}

function changeSection(id, component) {
    var child = $('#' + id).find(':first-child');
    if (child == null) {
        addComponent(id, component);
    } else {
        var cid = child.attr('id');
        $('#' + cid).fadeOut(() => {
            $('#' + cid).remove();
            addComponent(id, component);
        });
    }
}

function reloadSection(id, component) {
    let child = $('#' + id).find(':first-child');
    let cid = child.attr('id');
    $('#' + cid).remove();
    let data = fs.readFileSync(component);
    $('#' + id).html(data.toString());
}

function removeComponent(id) {
    var child = $('#' + id).find(':first-child');
    if (child == null) {
        return;
    } else {
        var cid = child.attr('id');
        $('#' + cid).fadeOut(() => {
            $('#' + cid).remove();
        });
    }
}

// note function

function note(id) {
    // force singleton
    var note = $('#note-div');
    if (note != null) {
        note = null;
    }
    // create new note
    addComponent('util', noteComp);

    var data = JSON.parse(fs.readFileSync('data/notes.json', 'utf8'));
    if (player.gender == 'boy') {
        var pref = "Mr.";
    } else if (player.gender == 'girl') {
        var pref = "Ms.";
    }
    $('.note-header').html(data[id]['header'] + " " + pref + " " + player.name + ",");
    $('.note-body').html(data[id]['body']);
    $('.note-footer').html(data[id]['footer']);
    $('#note-div').css("font-family", data[id]['font']);

    if (data[id]['action'] == 'close') {
        $('.note-action-top').html(
            "<span class='close' onclick='close'>&times;</span><script>$('.close').click(() => {$('#note-div').fadeOut(() => {$('#note-div').remove();});});</script>"
        );
    } else {
        $('.note-action-bottom').html(
            "<button class='title-btn' onclick='" + data[id]['action'] + "'>Ok</button>"
        );
    }
    $('.note').fadeIn();
}

// text display

function typeWriter(id, text) {
    clearTimeout(typeEffect);
    document.getElementById(id).innerHTML = "";
    var i = 0;
    var typeEffect = setInterval(function() {
        if (i < text.length) {
            document.getElementById(id).innerHTML += text.charAt(i);
            i++;
        } else {
            clearTimeout(typeEffect);
        }
    }, 50);
}

// mon functions

function geneticPotential(gf) {
    let sum = gf['hp'] + gf['atk'] + gf['def'] + gf['sAtk'] + gf['sDef'] + gf['speed'];
    if (sum < 25) {
        var pot = "Weak";
    } else if (sum >= 25 && sum < 49) {
        var pot = "Poor";
    } else if (sum >= 49 && sum < 97) {
        var pot = "Decent";
    } else if (sum >= 97 && sum < 121) {
        var pot = "Excellent";
    } else if (sum >= 121) {
        var pot = "Legendary";
    }

    return pot;
}

function getMoves(mon, lvl) {
    let mpid = mon['movePool'];
    let movePoolData = JSON.parse(fs.readFileSync('data/movePools.json', 'utf8'));
    let pool = movePoolData[mpid];
    var indices = [];
    for(let i = 0; i < pool['level'].length; i++){
        if(pool['level'][i] <= lvl) {
            indices.push(i);
        } else {
            break;
        }
    }
    if(indices.length > 4) {
        indices = indices.slice(-4);
    }
    var moveData = JSON.parse(fs.readFileSync('data/moves.json', 'utf8'));
    var moves = {};
    for(let i = 1; i <= indices.length; i++) {
        moves[i] = moveData[pool["id"][indices[i - 1]]];
    }

    return moves;
}

function partyPosition() {
    if(fs.existsSync('data/player/' + player.id + '-mons.json')){
        let monData = JSON.parse(fs.readFileSync('data/player/' + player.id + '-mons.json', 'utf8'));
        var pos = 1;
        for(let i = 0; i < monData['mons'].length; i++) {
            if(monData['mons'][i]['partyPosition'] > pos) {
                pos = monData['mons'][i]['partyPosition'];
            }
        }
        if(pos < player.partySize) {
            return pos + 1;
        } else {
            return 0;
        }
    } else {
        return 1;
    }
}

function createMon(id, lvl) {
    let monData = JSON.parse(fs.readFileSync('data/mons.json', 'utf8'));
    let monBase = monData[id];
    let geneticFactors = {
        "hp": Math.floor(Math.random() * 25),
        "atk": Math.floor(Math.random() * 25),
        "def": Math.floor(Math.random() * 25),
        "sAtk": Math.floor(Math.random() * 25),
        "sDef": Math.floor(Math.random() * 25),
        "speed": Math.floor(Math.random() * 25)
    }

    let potential = geneticPotential(geneticFactors);

    let mon = {
        "id": uuidv1(),
        "name": monBase['name'],
        "species": monBase['name'],
        "descripion": monBase['description'],
        "img": monBase['img'],
        "type": monBase['type'],
        "hp": {
            "current": Math.round((((parseInt(monBase['hp']) + parseInt(geneticFactors['hp'])) * lvl) / 50) + 5 + parseInt(lvl)),
            "max": Math.round((((parseInt(monBase['hp']) + parseInt(geneticFactors['hp'])) * lvl) / 50) + 5 + parseInt(lvl)),
        },
        "status": [],
        "stats": {
            "atk": Math.round((((monBase['atk'] + geneticFactors['atk']) * lvl) / 50) + 5),
            "def": Math.round((((monBase['def'] + geneticFactors['def']) * lvl) / 50) + 5),
            "sAtk": Math.round((((monBase['sAtk'] + geneticFactors['sAtk']) * lvl) / 50) + 5),
            "sDef": Math.round((((monBase['sDef'] + geneticFactors['sDef']) * lvl) / 50) + 5),
            "speed": Math.round((((monBase['speed'] + geneticFactors['speed']) * lvl) / 50) + 5),
        },
        "genetics": geneticFactors,
        "potential": potential,
        "level": lvl,
        "exp": {
            "current": Math.floor(0.8 * Math.pow(lvl, 3)),
            "next": Math.floor(0.8 * Math.pow((parseInt(lvl) + 1), 3))
        },
        "efforts": {
            "attack": {
                "contact": 0,
                "ranged": 0,
                "physical": 0,
                "special": 0,
                "status": 0
            },
            "defend": {
                "contact": 0,
                "ranged": 0,
                "physical": 0,
                "special": 0,
                "status": 0
            },
            "kill": 0,
            "yield": 0,
            "ko": 0,
            "win": 0,
            "loss": 0,
            "run": 0,
        },
        "happiness": 50,
        "moves": getMoves(monBase, lvl),
        "partyPosition": partyPosition()
    }

    return mon;
}

function setPartyMons() {
    partyMons = [];
    reserveMons = [];
    let monData = load(player.id + "-mons");
    for(let i = 0; i < monData['mons'].length; i++) {
        if(monData['mons'][i]['partyPosition'] != 0) {
            partyMons.push(monData['mons'][i]);
        } else {
            reserveMons.push(monData['mons'][i]);
        }
    }
}

function addMon(mon) {
    let monData = load(player.id + "-mons");
    monData['mons'].push(mon);
    saveMons(monData);
}