var showingNav = false;

$('#nav-main-btn').click(() => {
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
    console.log("show nav");
}

function hideNav() {
    console.log("hide nav");
}