$('#fight-btns-div').hide();

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