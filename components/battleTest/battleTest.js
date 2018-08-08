player = load('test-player');

givePop = false;

$('#battle-type-div').fadeIn();
$('#wild-choice-div').hide();
$('#trainer-choice-div').hide();
$('#give-choice-div').hide();


$('#trainer').click(() => {
    $('#battle-type-div').fadeOut(() => {
        populateTrainers();
        $('#trainer-choice-div').fadeIn();
    });
});

$('#wild').click(() => {
    $('#battle-type-div').fadeOut(() => {
        populateWildMons();
        $('#wild-choice-div').fadeIn();
    });
});

$('#give').click(() => {
    $('#wild-choice-div').fadeOut(() => {
        if(!givePop) {
            populateGiveMons();
        }
        $('#give-choice-div').fadeIn();
    });
});

$('#give-back').click(() => {
    $('#give-choice-div').fadeOut(() => {
        $('#wild-choice-div').fadeIn();
    });
});

function populateTrainers() {

}

function populateWildMons() {
    var data = JSON.parse(fs.readFileSync('data/mons.json'));
    Object.keys(data).forEach((i) => {
        $('#wild-list').append("<li class='wild-select' data='" + i + "'>" + data[i]['name'] + "</li>");
    });
    $('#wild-list').append("<script>$('.wild-select').click(function () {selectWild($(this).attr('data'));})</script>")
}

function populateGiveMons() {
    givePop = true;
    var data = JSON.parse(fs.readFileSync('data/mons.json'));
    Object.keys(data).forEach((i) => {
        $('#give-list').append("<li class='give-select' data='" + i + "'>" + data[i]['name'] + "</li>");
    });
    $('#give-list').append("<script>$('.give-select').click(function () {selectGive($(this).attr('data'));})</script>")
}

function selectWild(id) {
    wildMon = createMon(id, $('#lvl-input').val());
    battleType = 'wild';
    setPartyMons(player.id);
    changeSection('main', battleComp);
    removeComponent('util');
}

function selectGive(id) {
    let gMon = createMon(id, $('#give-lvl-input').val());
    addMon(gMon);
    $('#give-choice-div').fadeOut(() => {
        $('#wild-choice-div').fadeIn();
    });
}

