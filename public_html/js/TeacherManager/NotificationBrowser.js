"use strict";

function TMNotificationBrowser() {

    let self = this;

    let teacherNotificationList = null;
    let courseNotificationList = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};
    this.onCourseSelected = function(course) {};

    /** @type {TeacherValidator} */
    this.teacherValidator = null;

    let teachers = {};
    let courses = {};

    let options = {
        ignoreStudentAssistants: true
    };

    function addTeacherNotification(teacher, notification) {

        if (teacherNotificationList.children.length == 0) {
            createElement("h4", self.container, {innerHTML: "Teachers"});
            self.container.appendChild(teacherNotificationList);
        }

        let listItem = createElement("li", teacherNotificationList);
        let link = createElement("a", listItem, {
            innerHTML: notification,
            href: "#"
        });

        link.addEventListener("click", () => {
            self.onTeacherSelected(teacher);
        });
    }

    function addCourseNotification(course, notification) {

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

    this.initialize = function() {

        teacherNotificationList = createElement("ul");
        courseNotificationList = createElement("ul");
    };

    this.addTeachers = function(newTeachers) {
        for (let teacherID in newTeachers)
            teachers[teacherID] = newTeachers[teacherID];
    };

    this.processTeachers = function() {

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];

            let name = teacher.firstName + " " + teacher.lastName;

            function checkWorkload(season) {

                if (teacher.isExternal || teacher.isStudentAssistant)
                    return;

                if (!self.teacherValidator.hasWorkloadBelowThreshold(teacher, season)) {
                    let notification = name + " has a high workload during the " + season + " semester: " + Math.round(teacher.workloadNormalized[season] * 100) + "%";
                    addTeacherNotification(teacher, notification);
                }

                if (!self.teacherValidator.hasWorkloadAboveThreshold(teacher, season)) {
                    let notification = name + " has a low workload during the " + season + " semester: " + Math.round(teacher.workloadNormalized[season] * 100) + "%";
                    addTeacherNotification(teacher, notification);
                }
            }
            checkWorkload(TMCourse.Season.SPRING);
            checkWorkload(TMCourse.Season.FALL);
        }
    };

    this.addCourses = function(newCourses) {

        for (let courseID in newCourses)
            courses[courseID] = newCourses[courseID];
    };

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
                addCourseNotification(course, course.name + " (" + course.id + ") has low coverage: " + coverage + "%");
            }

            if (coverage > 100) {
                addCourseNotification(course, course.name + " (" + course.id + ") has high coverage: " + coverage + "%");
            }
        }
    };
}
