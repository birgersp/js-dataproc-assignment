
if (!TeacherManager)
    throw TMname + " is not defined";

// Global web application variable
window.webapp = {
    ui: new TMUserInterface()
//    data: new TMData()
};

webapp.displayError = function (error) {

    // TODO: display errors here (somehow), currently just throwing which prints stack trace to console
    throw error;
};

webapp.runApplication = function () {

//    webapp.ui.initialize();
};

webapp.start = function () {

    try {
        webapp.runApplication();
    } catch (error) {
        webapp.displayError(error);
    }
};
