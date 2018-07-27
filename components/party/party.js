partyMons = [];

function getPartyMons() {
    let monData = JSON.parse(fs.readFileSync('data/player/' + player.id + '-mon.json', 'utf8'));
    for(let i = 0; i < monData['mons'].length; i++) {
        if(monData['mons'][i]['partyPosition'] != 0) {
            partyMons.push(monData['mons'][i]);
        }
    }
}