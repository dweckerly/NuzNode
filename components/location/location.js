var maxLocWidth = 1073;
var maxLocHeight = 547;

function populateLocation() {
    let data = fs.readFileSync('data/locations.json');
    let d = JSON.parse(data);
    let locData = d[player.location];
    $('#location-img').attr('src', 'img/loc/' + locData["img"]);
    setImgDimensions();
    checkEvents(locData);
}

function setImgDimensions() {
    var hXw = maxLocHeight / maxLocWidth;
    var w = electron.remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().width;
    if ((w - 60) < maxLocWidth) {
        var imgW = w - 60;
        var imgH = imgW * hXw;
        $('#location-img').css({
            "height": imgH,
            "width": imgW
        });
    }
}

function checkEvents(data) {
    if (hasVisited()) {

    } else {
        if (data["firstVisit"][0] == 'dialogue') {
            eventVar = data['firstVisit'][1];
            addComponent('dialogue', dialogueComp);
        } else {

        }
    }
}

function hasVisited() {
    if (!player['visit'][player.location]) {
        player['visit'][player.location] = true;
        return false;
    }
    return true;
}

populateLocation();