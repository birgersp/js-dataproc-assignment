if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.TeacherBrowser = function() {

    this.container = null;

    this.initialize = function() {
    };

    this.setTeacherData = function(teachers) {
        this.container.innerHTML = "";
    };
};
