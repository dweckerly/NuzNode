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

function populateSwitch() {
    for(let i = 0; i < partyMons.length; i++) {
        if(partyMons[i] == currentPlayerMon) {
            $('#switch-content').append(`
            <div class='mon-container-current' id='` + partyMons[i].id + `'> 
                <img width='128' height='128' src='` + partyMons[i].img + `'>
                <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
            </div>
            `);
        } else {
            if(partyMons[i].hp.current > 0) {
                $('#switch-content').append(`
                <div class='mon-container available'>
                    <img width='64' height='64' src='` + partyMons[i].img + `'>
                    <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
                    <div class="switch-btn-div">
                        <button class="switch-in-btn" id='` + partyMons[i].id + `'>Switch In!</button>
                    </div>
                </div>
                `);
            } else {
                $('#switch-content').append(`
                <div class='mon-container'>
                    <img width='64' height='64' src='` + partyMons[i].img + `'>
                    <p>` + partyMons[i].name + ` ` + partyMons[i].hp.current + `/` + partyMons[i].hp.max + `</p>
                </div>
                `);
            }
            
        }
    }

    var switchBtns = document.getElementsByClassName("switch-in-btn");
    for(let i = 0; i < switchBtns.length; i++) {
        switchBtns[i].addEventListener("click", function () {
            let id = $(this).attr('data');
            $('#switch-mon-div').fadeOut(() => {
                switchMon(id);
            });
        });
    }
}

populateSwitch();