include("UserInterface.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.App = function () {

    this.ui = new TeacherManager.UserInterface();
    this.ui.initialize();
};
