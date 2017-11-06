
if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkLoadBrowser = function () {

    let container = null;
    let eventHandler = null;

    this.setContainer = function (newContainer) {
        container = newContainer;
    };

    this.setEventHandler = function (newEventHandler) {
        eventHandler = newEventHandler;
    };

    this.initialize = function () {

    };
};
