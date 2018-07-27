function goToRanch() {
    removeComponent('util');
    changeSection('main', locationComp);
    addComponent('header', navComp);
}