if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.Course = function () {

    // ID
    this.id = null;

    // Name
    this.name = null;

    // Number of credits
    this.credits = null;

    // Programme study year
    this.studyYear = null;

    // Is mandatory
    this.mandatory = null;

    // Season
    this.season = null;

    // Number of students
    this.numberOfStudents = null;

    // Allocated teacher hours
    this.teacherWorkloadHours = null;

    this.isValid = function () {
        for (let key in this) {
            if (this[key] == null)
                return false;
        }
        return true;
    };
};

TeacherManager.Course.Season = {
    SPRING: 1,
    FALL: 2
};
