var c = document.getElementById('main-canvas');
var ctx = c.getContext('2d');

$('#back').click(() => {
    changeSection('main', titleComp);
});

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}