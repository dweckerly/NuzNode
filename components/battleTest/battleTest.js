$('#battle-type-div').fadeIn();
$('#wild-choice-div').hide();
$('#trainer-choice-div').hide();


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

function populateTrainers() {

}

function populateWildMons() {
    var data = JSON.parse(fs.readFileSync('data/mons.json'));
    Object.keys(data).forEach((i) => {
        $('#wild-list').append("<li class='wild-select' data='" + i + "'>" + data[i]['name'] + "</li>");
    });
    $('#wild-list').append("<script>$('.wild-select').click(function () {selectWild($(this).attr('data'));})</script>")
}

function selectWild(id) {
    player = load('test-player');
    wildMon = createMon(id, $('#lvl-input').val());
    battleType = 'wild';
    setPartyMons(player.id);
    changeSection('main', battleComp);
    removeComponent('util');
}