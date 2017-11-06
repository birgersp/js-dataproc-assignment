
if (!TeacherManager)
    throw TeacherManager.name + " is not defined";

// Global web application variable
window.webapp = {
    data: new TeacherManager.Data()
};

webapp.displayError = function (error) {

    // TODO: display errors here (somehow), currently just throwing which prints stack trace to console
    throw error;
};

webapp.runApplication = function () {

    console.log(webapp.data.x);
};

webapp.start = function () {

    try {
        webapp.runApplication();
    } catch (error) {
        webapp.displayError(error);
    }
};
