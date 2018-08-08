$('#fight-btns-div').hide();
function populateMoveBtns() {
    $('#atk-1').html(currentPlayerMon['moves']['1']['name']);
    $('#atk-1').attr('data', 1);
    if("2" in currentPlayerMon['moves']) {
        $('#atk-2').html(currentPlayerMon['moves']['2']['name']);
        $('#atk-2').attr('data', 2);
        if('3' in currentPlayerMon['moves']) {
            $('#atk-3').html(currentPlayerMon['moves']['3']['name']);
            $('#atk-3').attr('data', 3);
            if('4' in currentPlayerMon['moves']) {
                $('#atk-4').html(currentPlayerMon['moves']['4']['name']);
                $('#atk-4').attr('data', 4);
            } else {
                $('#atk-4').prop("disabled", true);
            }
        } else {
            $('#atk-3').prop("disabled", true);
            $('#atk-4').prop("disabled", true);
        }
    } else {
        $('#atk-2').prop("disabled", true);
        $('#atk-3').prop("disabled", true);
        $('#atk-4').prop("disabled", true);
    }
}
populateMoveBtns();

$('#fight-btn').click(() => {
    $('#battle-util-div').fadeOut(() => {
        $('#fight-btns-div').fadeIn();
    });
});

$('#mon-btn').click(() => {
    populateSwitch();
    $('#switch-mon-div').fadeIn();
});

$('#catch-btn').click(() => {
    
});

$('#back-btn').click(() => {
    $('#fight-btns-div').fadeOut(() => {
        $('#battle-util-div').fadeIn();
    });
});

$('.atk-btn').click(function () {
    actions.player.action = "attack";
    actions.player.id = $(this).attr('data');
    endSelectPhase();
});