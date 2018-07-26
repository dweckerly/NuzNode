var gender;
var age;

var save = false;

$('#intro-div').css({
    "position": "absolute",
    "top": "0",
    "left": "0",
    "height": "100%",
    "width": "100%",
    "background-color": "black"
});

$('#boy-btn').hover(() => {
    $('#gender-label').css("color", "white");
    $('#gender-label').html("boy?");
});

$('#girl-btn').hover(() => {
    $('#gender-label').css("color", "white");
    $('#gender-label').html("girl?");
});

$('#age-input').change(() => {
    $('#age').html($('#age-input').val());
});

$('#age-submit').click(() => {
    age = $('#age-input').val();
    $("#age-select").fadeOut(() => {
        $("#name-form").fadeIn();
        $('#name-input').focus();
    });
});

$('#name-input').keypress((e) => {
    if (e.which == 13) {
        if ($('#name-input').val() != "" && !save) {
            save = true;
            var name = $('#name-input').val();
            newSave(name, gender, age, () => {
                $('#name-form').fadeOut();
                note(1)
            });
        }
    }
});

$('#boy-btn').click(() => {
    gender = "boy";
    $("#gender-select").fadeOut(() => {
        $("#age-select").fadeIn();
        $('#age-input').focus();
    });
});

$('#girl-btn').click(() => {
    gender = "girl";
    $("#gender-select").fadeOut(() => {
        $("#age-select").fadeIn();
        $('#age-input').focus();
    });
});