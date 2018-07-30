function createList() {
    var files = loadSaves();
    console.log(files);
    for(let i = 0; i < files.length; i++) {
        let data = JSON.parse(fs.readFileSync(files[i]));
        if(data['name']) {
            $('#load-list').append(
                "<li class='load-item' data='" + data['id'] + "'>" + data['name'] + " " + data['gender'] + " " + data['age'] + "</li>"
            )
        }
    }
}

$('.load-item').click(function () {
    let data = $(this).attr('data');
});

createList();