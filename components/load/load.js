function createList() {
    var files = loadSaves();
    for(let i = 0; i < files.length; i++) {
        let data = JSON.parse(fs.readFileSync(files[i]));
        if(data['name']) {
            $('#load-list').append(
                "<li class='load-item' data='" + data['id'] + "' data-time='" + data['created'] + "'>" + data['name'] + " " + data['gender'] + " " + data['age'] + "</li>"
            )
        }
    }
    sortList();
    $('#load-list').append(
        "<script>$('.load-item').click(function () {let data = $(this).attr('data');player = load(data);state = 'location';goToLocation();});</script>"
    );
}

function sortList() {
    var i;
    var shouldSwitch, switching = true;
    var list = $('#load-list');
    while(switching) {
        switching = false;
        var items = list.children();
        for(i = 0; i < (items.length - 1); i++) {
            shouldSwitch = false;
            let times = [items[i].getAttribute('data-time'), items[i + 1].getAttribute('data-time')];
            console.log(times);
            if(times[0] > times[1]) {
                shouldSwitch = true;
                break;
            }
        }
        if(shouldSwitch) {
            items[i].parentNode.insertBefore(items[i + 1], items[i]);
            switching = true;
        }
    }
}

$('.load-item').click(function () {
    let data = $(this).attr('data');
    player = load(data);
    setPartyMons();
    state = 'location';
    goToLocation();
});

createList();