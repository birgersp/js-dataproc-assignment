"use strict";

/**
 * Creates an instance which processes a set of teachers and courses and displays information (remarks) about them
 * @returns {TMNotificationBrowser}
 */
function TMNotificationBrowser() {

    let self = this;

    let teacherNotificationList = null;
    let courseNotificationList = null;

    this.container = null;

    /**
     * Callback which is invoked when a teacher is selected (clicked)
     * @param {TMTeacher} teacher
     */
    this.onTeacherSelected = function(teacher) {};

    /**
     * Callback which is invoked when a course is selected (clicked)
     * @param {TMCourse} course
     */
    this.onCourseSelected = function(course) {};

    /** @type {TeacherValidator} */
    this.dataValidator = null;

    let teachers = {};
    let courses = {};

    let options = {
        ignoreStudentAssistants: true
    };

    /**
     * Adds a new remark about a teacher by adding an item to the list of teacher remarks
     * The item is clickable, and clicking it invokes the "onTeacherSelected" function of this instance
     * @param {TMTeacher} teacher
     * @param {String} remark
     */
    function addTeacherRemark(teacher, remark) {

        if (teacherNotificationList.children.length == 0) {
            createElement("h4", self.container, {innerHTML: "Teachers"});
            self.container.appendChild(teacherNotificationList);
        }

        let listItem = createElement("li", teacherNotificationList);
        let link = createElement("a", listItem, {
            innerHTML: remark,
            href: "#"
        });

        link.addEventListener("click", () => {
            self.onTeacherSelected(teacher);
        });
    }

    /**
     * Adds a new remark about a course by adding an item to the list of course remarks
     * The item is clickablke, and clicking it invokes the "onCourseSelected" function of this instance
     * @param {TMCourse} course
     * @param {String} notification
     */
    function addCourseRemark(course, notification) {

        if (courseNotificationList.children.length == 0) {
            createElement("h4", self.container, {innerHTML: "Courses"});
            self.container.appendChild(courseNotificationList);
        }

        let listItem = createElement("li", courseNotificationList);
        let link = createElement("a", listItem, {
            innerHTML: notification,
            href: "#"
        });

        link.addEventListener("click", () => {
            self.onCourseSelected(course);
        });
    }

    /**
     * Creates two lists, for teacher and course remarks
     */
    this.initialize = function() {

        teacherNotificationList = createElement("ul");
        courseNotificationList = createElement("ul");
    };

    /**
     * Adds information about teachers to be processed
     * @param {Object} newTeachers
     */
    this.addTeachers = function(newTeachers) {
        for (let teacherID in newTeachers)
            teachers[teacherID] = newTeachers[teacherID];
    };

    /**
     * Iterates through all teachers and checks whether remarks should be added or not
     */
    this.processTeachers = function() {

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];

            let name = teacher.firstName + " " + teacher.lastName;

            function checkWorkload(season) {

                if (teacher.isExternal || teacher.isStudentAssistant)
                    return;

                if (!self.dataValidator.teacherHasWorkloadBelowThreshold(teacher, season)) {
                    let notification = name + " has a high workload during the " + season + " semester: " + Math.round(teacher.workloadNormalized[season] * 100) + "%";
                    addTeacherRemark(teacher, notification);
                }

                if (!self.dataValidator.teacherHasWorkloadAboveThreshold(teacher, season)) {
                    let notification = name + " has a low workload during the " + season + " semester: " + Math.round(teacher.workloadNormalized[season] * 100) + "%";
                    addTeacherRemark(teacher, notification);
                }
            }
            checkWorkload(TMCourse.Season.SPRING);
            checkWorkload(TMCourse.Season.FALL);
        }
    };

    /**
     * Adds information about courses to be processed
     * @param {TMCourse} newCourses
     */
    this.addCourses = function(newCourses) {

        for (let courseID in newCourses)
            courses[courseID] = newCourses[courseID];
    };

    /**
     * Iterates through all courses and checks whether remarks should be added or not
     */
    this.processCourses = function() {

        for (let courseID in courses) {
            let course = courses[courseID];

            let coverage = 0;
            for (let teacherID in course.teachingCoveredPercent) {

                if (options.ignoreStudentAssistants && teachers[teacherID].isStudentAssistant) {
                    continue;
                }

                coverage += course.teachingCoveredPercent[teacherID];
            }

            if (coverage < 100) {
                addCourseRemark(course, course.name + " (" + course.id + ") has low coverage: " + coverage + "%");
            }

            if (coverage > 100) {
                addCourseRemark(course, course.name + " (" + course.id + ") has high coverage: " + coverage + "%");
            }
        }
    };
}
