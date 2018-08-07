function randomMoveSelect() {
    actions.opponent.action = "attack";
    actions.opponent.id = (Math.floor(Math.random() * Object.keys(currentOpponentMon.moves).length) + 1);
}