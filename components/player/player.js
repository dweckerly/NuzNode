function populatePlayerView() {
    $('#player-name').html(player.name);
    $('#player-age').html("Age: " + player.age);
    $('#player-gender').html("Gender: " + player.gender);
    $('#player-exp').html("EXP: " + player.exp);
    $('#player-level').html("Level: " + player.level);
}

populatePlayerView();