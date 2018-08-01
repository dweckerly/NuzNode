function randomMoveSelect(monMoves) {
    opponentAction = 'attack';
    opponentMoveId = (Math.floor(Math.random() * Object.keys(monMoves).length) + 1);
}