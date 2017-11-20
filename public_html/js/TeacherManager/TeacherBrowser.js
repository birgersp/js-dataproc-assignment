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

        attributeHeaders.push("Spring workload [hours]");
        attributeHeaders.push("Fall workload [hours]");

        function addTeachers(label, teachers) {
            listBrowser.addList(label, attributeHeaders);

            for (let teacherID in teachers) {
                let teacher = teachers[teacherID];
                let attributeValues = [];
                for (let attributeKey in attributeKeys) {
                    attributeValues.push(teacher[attributeKey]);
                }

                attributeValues.push(teacher.workload.spring);
                attributeValues.push(teacher.workload.fall);

                listBrowser.addListItem(teacherID, attributeValues);
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

        function addCourses(label, courses) {

            let coursesCell = listBrowser.createDetail(label);
            let coursesList = createElement("ul", coursesCell, {
                style: "margin-bottom: 0px;"
            });

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

        listBrowser.clearDetails();

        for (let key in attributeKeys)
            listBrowser.addDetail(attributeKeys[key], teacher[key]);

        listBrowser.addDetail("Workload, spring", teacher.workload.spring + " hours (" + Math.round(teacher.workloadNormalized.spring * 100) + "%)");
        listBrowser.addDetail("Workload, fall", teacher.workload.fall + " hours (" + Math.round(teacher.workloadNormalized.fall * 100) + "%)");

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

        listBrowser.enableDetailView();
    };

    this.resetView = function() {

        listBrowser.disableDetailView();
    };
}
