var choice;
var name;

$('#mon-img-1').attr('src', "img/mons/carnipula.png");
$('#mon-img-2').attr('src', "img/mons/embah.png");
$('#mon-img-3').attr('src', "img/mons/derple.png");

$('.choose-btn').click(function() {
    var id = $(this).attr('data');
    if (id == 1) {
        name = "Carnipula";
        $('#question').html("So you choose Carnipula?");
        $('#choice-img').attr('src', "img/mons/carnipula.png");
    } else if (id == 4) {
        name = "Embah";
        $('#question').html("So you choose Embah?");
        $('#choice-img').attr('src', "img/mons/embah.png");
    } else if (id == 7) {
        name = "Derple";
        $('#question').html("So you choose Derple?");
        $('#choice-img').attr('src', "img/mons/derple.png");
    }
    $('#yes-btn').attr('data', id);
    $('#choices').fadeOut(() => {
        $('#choice').fadeIn();
    });
});

$('#no-btn').click(() => {
    $('#choice').fadeOut(() => {
        $('#choices').fadeIn();
    });
});

$('#yes-btn').click(function() {
    choice = $(this).attr('data');
    $('#select-panel').fadeOut(() => {
        state = 'naming';
        $('#name-panel').fadeIn();
        $('#mon-name-input').focus();
    });
});

$('body').keyup(function(event) {
    if (event.keyCode === 13 && state == 'naming') {
        if ($('#mon-name-input').val() != "") {
            name = $('#mon-name-input').val();
        }
        saveFirstMon();
        $('#chooseMon-div').fadeOut(() => {
            removeComponent('event');
            eventVar = "max-prune-2";
            reloadSection('dialogue', dialogueComp);
        });
    }
});

function saveFirstMon() {
    mon = {
        "mons": [createMon(choice, 3)]
    }
    mon["mons"][0]['name'] = name;
    fs.writeFileSync("data/player/" + player.id + "-mons.json", JSON.stringify(mon), "utf8");
    saveSync();
}