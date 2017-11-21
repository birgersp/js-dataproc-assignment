"use strict";

include("ListBrowser.js");

function TMTeacherBrowser() {

    let self = this;

    let attributeKeys = {
        lastName: "Lastname",
        firstName: "Firstname",
        facultyCode: "Faculty",
        departmentCode: "Department",
        employmentPercentage: "% Employment"
    };

    let teachers = {};

    let listBrowser = new TMListBrowser();

    this.container = null;

    this.onCourseSelected = function(course) {};

    /** @type {TMDataValidator} */
    this.dataValidator = null;

    this.initialize = function() {

        listBrowser = new TMListBrowser();
        listBrowser.container = self.container;
        listBrowser.initialize();
        listBrowser.itemSelected = (id) => {
            let teacher = teachers[id];
            self.showTeacherDetails(teacher);
        };
    };

    this.addTeachers = function(newTeachers) {

        let attributeHeaders = [];
        for (let attributeKey in attributeKeys) {
            attributeHeaders.push(attributeKeys[attributeKey]);
        }

        attributeHeaders.push("Spring workload");
        attributeHeaders.push("Fall workload");

        function addTeachers(label, teachers) {
            listBrowser.addList(label, attributeHeaders);

            for (let teacherID in teachers) {

                listBrowser.addListRow(teacherID);

                let teacher = teachers[teacherID];
                let attributeValues = [];
                for (let attributeKey in attributeKeys) {
                    listBrowser.addListValue(teacher[attributeKey]);
                }

                let springWorkloadValid =
                        self.dataValidator.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.SPRING) &&
                        self.dataValidator.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.SPRING);
                listBrowser.addListValue(teacher.workload.spring + "h (" + Math.round(teacher.workloadNormalized.spring * 100) + "%)", !springWorkloadValid);

                let fallWorkloadValid =
                        self.dataValidator.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.FALL) &&
                        self.dataValidator.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.FALL);
                listBrowser.addListValue(teacher.workload.fall + "h (" + Math.round(teacher.workloadNormalized.fall * 100) + "%)", !fallWorkloadValid);
            }
        }

        let regularTeachers = {};
        let studAssTeachers = {};
        let externalTeachers = {};

        for (let teacherID in newTeachers) {
            let teacher = newTeachers[teacherID];

            teachers[teacherID] = teacher;

            if (teacher.isStudentAssistant)
                studAssTeachers[teacherID] = teacher;
            else //
            if (teacher.isExternal)
                externalTeachers[teacherID] = teacher;
            else //
                regularTeachers[teacherID] = teacher;
        }

        addTeachers(null, regularTeachers);
        addTeachers("Student Assistants", studAssTeachers);
        addTeachers("External Teachers", externalTeachers);
    };

    this.showTeacherDetails = function(teacher) {

        listBrowser.clearDetails();

        for (let key in attributeKeys)
            listBrowser.addDetail(attributeKeys[key], teacher[key]);

        listBrowser.addDetail("Is student assistant", teacher.isStudentAssistant);
        listBrowser.addDetail("Is external", teacher.isExternal);

        listBrowser.addDetail("Workload, spring", teacher.workload.spring + " hours (" + Math.round(teacher.workloadNormalized.spring * 100) + "%)");
        listBrowser.addDetail("Workload, fall", teacher.workload.fall + " hours (" + Math.round(teacher.workloadNormalized.fall * 100) + "%)");

        function addCourses(label, courses) {

            let coursesCell = listBrowser.createDetail(label);
            let coursesList = createElement("ul", coursesCell);

            for (let courseID in courses) {
                let course = courses[courseID];

                let coveragePercentage = course.teachingCoveredPercent[teacher.id];
                let coverageHours = Math.round(coveragePercentage / 100 * course.teacherWorkloadHours);

                let linkText = course.name + " (" + coverageHours + " hours)";

                let listItem = createElement("li", coursesList);
                let link = createElement("a", listItem, {href: "#", innerHTML: linkText});
                link.addEventListener("click", () => {
                    self.onCourseSelected(course);
                });
            }
        }

        let springCourses = {};
        let fallCourses = {};

        for (let courseID in teacher.courses) {
            let course = teacher.courses[courseID];
            if (course.season === TMCourse.Season.SPRING)
                springCourses[courseID] = course;
            else
                fallCourses[courseID] = course;
        }

        if (Object.keys(springCourses).length > 0)
            addCourses("Courses, spring", springCourses);

        if (Object.keys(fallCourses).length > 0)
            addCourses("Courses, fall", fallCourses);

        let notifications = [];

        let getWorkloadPercentage = (season) => {
            return Math.round(teacher.workloadNormalized[season] * 100);
        };

        let validateBelowThreshold = (season) => {
            if (!self.dataValidator.teacherHasWorkloadBelowThreshold(teacher, season))
                notifications.push("Workload (" + season + ") is too high (" + getWorkloadPercentage(season) + "%)");
        };

        let validateAboveThreshold = (season) => {
            if (!self.dataValidator.teacherHasWorkloadAboveThreshold(teacher, season))
                notifications.push("Workload (" + season + ") is too low (" + getWorkloadPercentage(season) + "%)");
        };

        validateBelowThreshold(TMCourse.Season.SPRING);
        validateBelowThreshold(TMCourse.Season.FALL);

        validateAboveThreshold(TMCourse.Season.SPRING);
        validateAboveThreshold(TMCourse.Season.FALL);

        if (notifications.length > 0) {
            let notificationsCell = listBrowser.createDetail("Remarks");
            let list = createElement("ul", notificationsCell);

            for (let i in notifications)
                createElement("li", list, {innerHTML: notifications[i], style: "color: red"});
        }

        listBrowser.enableDetailView();
    };

    this.resetView = function() {

        listBrowser.disableDetailView();
    };
}
