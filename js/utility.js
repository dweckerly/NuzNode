const electron = require('electron');
const fs = require('fs');

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
    }, 20);
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

function getMoves(id, lvl) {

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
        "name": monBase['name'],
        "species": monBase['name'],
        "descripion": monBase['description'],
        "img": monBase['img'],
        "type": [],
        "hp": {
            "current": Math.round((((monBase['hp'] + geneticFactors['hp']) * lvl) / 50) + 5 + lvl),
            "max": Math.round((((monBase['hp'] + geneticFactors['hp']) * lvl) / 50) + 5 + lvl),
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
            "next": Math.floor(0.8 * Math.pow((lvl + 1), 3))
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
        "moves": getMoves(id, lvl),

    }

    return mon;
}