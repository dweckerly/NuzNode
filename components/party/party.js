populatePartyView();
function populatePartyView() {
    setPartyMons();
    var j = 0;
    $('#party-main').append("<div id='" + j + "-row' class='row'>");
    for(let i = 0; i < partyMons.length; i++) {
        if(i % 3 == 0 && i != 0){
            j++
            $('#party-main').append("</div>");
            $('#party-main').append("<div id='" + j + "-row' class='row'>");
        }
        $("#" + j + "-row").append(`
            <div class='col-30'>
                <img class='party-mon-img' height='120' width='120' src=` + partyMons[i].img + `>
                <p>` + partyMons[i].name + `</p>
            </div>
        `);
    }
}