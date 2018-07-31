
function showBattleText() {
    $('#battle-text-div').fadeIn(() => {
        typeWriter('battle-text', "What will " + playerMonName + " do?");
    });
}

function typeWriter(id, text) {
    clearTimeout(typeEffect);
    document.getElementById(id).innerHTML = "";
    var i = 0;
    var typeEffect = setInterval(function() {
        if (i < text.length) {
            document.getElementById(id).innerHTML += text.charAt(i);
            i++;
        } else {
            clearTimeout(typeEffect);
        }
    }, 20);
}
