if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.Tab = function() {

    let tab = this;

    this.container = null;
    this.id = null;
    this.tabLink = null;

    this.open = function() {
        tab.tabLink.click();
        tab.onOpen();
    };

    this.onOpen = function() {
        // Can be overriden
    };
};
