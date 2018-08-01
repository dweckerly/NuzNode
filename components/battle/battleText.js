
function showBattleText() {
    $('#battle-text-div').fadeIn(() => {
        typeWriter('battle-text', "What will " + playerMonName + " do?");
    });
}