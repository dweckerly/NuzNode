var showingNav = false;

$('#nav-main-btn').click((event) => {
    event.stopImmediatePropagation();
    if (state != 'speaking' && state != 'event' && state != 'choosing') {
        if (showingNav) {
            hideNav();
        } else {
            showNav();
        }
    } else {
        console.log("can't click");
    }
});

//$('#player-nav').html(player.name);

$('.nav-btn').click(function(event) {
    event.stopImmediatePropagation();
    let comp = $(this).attr('data');
    switch (comp) {
        case 'inventory':
            changeSection('main', inventoryComp);
            break;
        case 'map':
            changeSection('main', mapComp);
            break;
        case 'party':
            changeSection('main', partyComp);
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