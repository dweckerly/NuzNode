var showingNav = false;

$('#nav-main-btn').click((event) => {
    event.stopImmediatePropagation()
    if(state != 'speaking' && state != 'event' && state != 'choosing') {
       if(showingNav) {
           hideNav();
       } else {
           showNav();
       }
    } else {
        console.log("can't click");
    }
});

function showNav() {
    showingNav = true;
    $('#nav-side').css("width", "120px")
}

function hideNav() {
    showingNav = false;
    $('#nav-side').css("width", "0px")
}