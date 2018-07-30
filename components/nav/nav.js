var showingNav = false;

$('#nav-main-btn').click((event) => {
    event.stopImmediatePropagation();
    if (state != 'speaking' && state != 'event' && state != 'choosing') {
        if (showingNav) {
            hideNav();
        } else {
            showNav();
        }
    }
});

$('.nav-btn').click(function(event) {
    event.stopImmediatePropagation();
    let comp = $(this).attr('data');
    switch (comp) {
        case 'inventory':
            changeSection('main', inventoryComp);
            break;
        case 'map':
            player.location = 0;
            saveSync();
            changeSection('main', mapComp);
            break;
        case 'party':
            changeSection('main', partyComp);
            break;
        case 'player':
            changeSection('main', playerComp);
            break;
        default:
            break;
    }
    hideNav();
});

function showNav() {
    showingNav = true;
    $('#nav-side').css("width", "120px")
}

function hideNav() {
    showingNav = false;
    $('#nav-side').css("width", "0px")
}