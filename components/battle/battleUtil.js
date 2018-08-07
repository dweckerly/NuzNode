function updatePartyMons() {
    for(let i = 0; i < partyMons.length; i++) {
        if(partyMons[i].id == currentPlayerMon.id) {
            partyMons[i] = currentPlayerMon;
        }
    }
    if(battleType == "trainer") {
        for(let i = 0; i < opponentMons.length; i++) {
            if(opponentMons[i].id == currentOpponentMon.id) {
                opponentMons[i] = currentopponentMon;
            }
        }
    }
}