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
    addComponent('util', battleTestComp);
});

$('#anim-test').click(() => {
    changeSection('main', animTestComp);
});

$('#map-test').click(() => {
    changeSection('main', mapTestComp);
});