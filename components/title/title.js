if (!checkSaves()) {
    $('#load-btn').hide();
} else {
    $('#load-btn').click(() => {
        changeSection('main', loadComp);
    });
}

$("#new-btn").click(() => {
    changeSection('main', introComp);
});