function readSave() {
    let data = fs.readFileSync('data/player/' + player['id'] + '.json');
    let json = JSON.parse(data);
    return json;
}

function loadSaves() {
    return glob.sync('data/player/*.json');
}

function load(id) {
    let data = fs.readFileSync('data/player/' + id + '.json');
    let json = JSON.parse(data);
    return json;
}

function checkSaves() {
    var files = glob.sync('data/player/*.json');
    if (files.length > 0) {
        return true;
    }
    return false;
}

function saveMons(data) {
    fs.writeFileSync("data/player/" + player.id + "-mons.json", JSON.stringify(data), "utf8");
}

function saveSync() {
    fs.writeFileSync("data/player/" + player.id + ".json", JSON.stringify(player), "utf8");
}

function saveAsync(callback) {
    fs.writeFile("data/player/" + player.id + ".json", JSON.stringify(player), "utf8", callback);
}

function newPlayer(name, gender, age) {
    var skills = []
    var uid = uuidv4();

    // add gender skill
    if (gender == "boy") {
        skills.push(1);
    } else if (gender == "girl") {
        skills.push(2);
    }

    // add age skill
    if (age < 18) {
        skills.push(3);
    } else if (age >= 18 && age < 36) {
        skills.push(5);
    } else if (age >= 36 && age < 50) {
        skills.push(6);
    } else if (age >= 50) {
        skills.push(4);
    }

    player = {
        id: uid,
        created: Date.now(),
        name: name,
        gender: gender,
        age: age,
        location: 1,
        exp: 0,
        level: 1,
        partySize: 3,
        skills: skills,
        visit: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            11: false,
            12: false
        }
    };
}