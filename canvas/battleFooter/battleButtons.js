$('#fight-btn').click(function() {
    $('#battle-btns').fadeOut("fast", function() {
        $('#move-btns').fadeIn("fast");
    });
});

$('#back-battle-btn').click(function() {
    $('#move-btns').fadeOut("fast", function() {
        $('#battle-btns').fadeIn("fast");
    });
});

$('#catch-btn').click(function () {
    itemView();
});

$('#nuzmon-btn').click(function () {
    nuzMonView();
});

$('.nuz-list-item').click(function () {
    jQuery('.collapse').collapse('hide');
});


$('#run-btn').click(function() {
    backToLocation();
});