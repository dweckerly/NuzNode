var dialogue;
var i = 0;
var j = 0;

var tw;

instantiate();

function instantiate() {
    var d = fs.readFileSync("data/dialogues/" + eventVar + ".json");
    dialogue = JSON.parse(d);
    $('#person-img').attr('src', dialogue['img']);
    $('#name-label').html(dialogue['name']);
    $('#name-label').css("font-family", dialogue['font']);
    $('#speech').css("font-family", dialogue['font']);
    $('#dialogue-btn-div').html("<button class='dialogue-btn' id='next-btn' onclick='next()'>Next</button>");
    state = 'speaking';
    displayText();
}


function displayText() {
    $('#next-btn').prop('disabled', true);
    typeWriter('speech', dialogue[i]['text'][j]);
}

function next() {
    j++;
    if (j < dialogue[i]['text'].length) {
        displayText();
    } else {
        switch (dialogue[i]['response']) {
            case ('chooseMon'):
                state = 'choosing';
                giveFirstMon();
                break;
            default:
                break;
        }
    }
}

function typeWriter(id, text) {
    clearTimeout(typeEffect);
    document.getElementById(id).innerHTML = "";
    tw = 0;
    var typeEffect = setInterval(function() {
        if (tw < text.length) {
            document.getElementById(id).innerHTML += text.charAt(tw);
            tw++;
        } else {
            clearTimeout(typeEffect);
            $('#next-btn').prop('disabled', false);
        }
    }, 20);
}

$('body').keyup(function(event) {
    if (event.keyCode === 13 && state == 'speaking') {
        if ($('#next-btn').prop('disabled') == false) {
            $("#next-btn").click();
        } else {
            tw = dialogue[i]['text'][j].length;
            document.getElementById('speech').innerHTML = dialogue[i]['text'][j];
            $('#next-btn').prop('disabled', false);
        }
    }
});

function giveFirstMon() {
    addComponent('event', chooseMonComp);
}