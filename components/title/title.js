if (checkSaves()) {
    $('#load-btn').click(() => {
        changeSection('main', loadComp);
    });
} else {
    $('#load-btn').hide();
}

$("#new-btn").click(() => {
    changeSection('main', introComp);
});

$('#battle-test').click(() => {
    changeSection('main', battleComp);
});