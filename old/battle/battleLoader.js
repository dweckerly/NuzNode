var playerCurrentMon;
var opponentCurrentMon;

$(document).ready(function() {
    for(var key in playerMons) {
        if (playerMons[key]['alive'] == 1) {
            playerCurrentMon = key;
            break;
        }
    }
    for(var key in opponentMons) {
        if (opponentMons[key]['alive'] == 1) {
            opponentCurrentMon = key;
            break;
        }
    }

    $('#opponent-health').attr('aria-valuenow', opponentMons[opponentCurrentMon]['currentHp']);
    $('#opponent-health').attr('aria-valuemax', opponentMons[opponentCurrentMon]['maxHp']);
    $('#opponent-health').css('width', '100%');

    $('#player-health').attr('aria-valuenow', playerMons[playerCurrentMon]['currentHp']);
    $('#player-health').attr('aria-valuemax', playerMons[playerCurrentMon]['maxHp']);

    var pHealth = Math.round((playerMons[playerCurrentMon]['currentHp'] / playerMons[playerCurrentMon]['maxHp']) * 100);
    $('#player-health').css('width', pHealth + '%');

    $('#opponent-img').attr('src', "img/mons/" + opponentMons[opponentCurrentMon]['img']);
    $('#player-img').attr('src', "img/mons/" + playerMons[playerCurrentMon]['img']);

    $('#opponent-name').html(opponentMons[opponentCurrentMon]['name']);
    $('#player-name').html(playerMons[playerCurrentMon]['name']);
    var status = playerMons[playerCurrentMon]['status'];
    $('#player-status').html(status.toUpperCase());
});


$('#player-img').on('animationend', function() {
    $('#player-img').removeClass('battle-anim-slidein-left');
    $.get(bFooterComp, function(data) {
        $('#footer').append(data).hide().fadeIn('fast');
    });
});

$('#opponent-img').on('animationend', function() {
    $('#opponent-img').removeClass('battle-anim-slidein-right');
});