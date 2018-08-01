$('#back-util').click(function () {
    $('#battle-util').fadeOut('fast', function () {
        $('#battle-main').fadeIn('fast');
        $('#battle-footer').fadeIn('fast');
    });
});