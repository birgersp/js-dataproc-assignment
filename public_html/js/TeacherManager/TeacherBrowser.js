"use strict";

include("ListBrowser.js");

function TMTeacherBrowser() {

    let self = this;

    let attributeKeys = {
        lastName: "Lastname",
        firstName: "Firstname",
        facultyCode: "Faculty",
        departmentCode: "Department",
        isExternal: "Is external",
        isStudentAssistant: "Is stud.ass.",
        employmentPercentage: "% Employment"
    };

    let teacherOverviewDiv = null;
    let teacherDetailedView = null;
    let teachers = {};

    let listBrowser = new TMListBrowser();

    this.container = null;

    this.onCourseSelected = function(course) {};

    this.initialize = function() {

        this.container.innerHTML = "";

        listBrowser.container = self.container;
        listBrowser.itemSelected = (id) => {
            let teacher = teachers[id];
            self.showTeacherDetails(teacher);
        };

//        teacherOverviewDiv = createElement("div", self.container);
//        teacherOverviewDiv.appendChild(warningHeader);
//
//        teacherDetailedView = createElement("div", self.container);
//        teacherDetailedView.appendChild(warningHeader);
//
//
    };

    /**
     *
     * @param {TMTeacher[]} newTeachers
     */
    this.addTeachers = function(newTeachers) {

        let attributeHeaders = [];
        for (let attributeKey in attributeKeys) {
            attributeHeaders.push(attributeKeys[attributeKey]);
        }

        function addTeachers(label, teachers) {
            listBrowser.addList(label, attributeHeaders);

            for (let teacherID in teachers) {
                let teacher = teachers[teacherID];
                let attributeValues = [];
                for (let attributeKey in attributeKeys) {
                    attributeValues.push(teacher[attributeKey]);
                }
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

        console.log(teacher);

//        teacherDetailedView.innerHTML = "";
//        let table = createElement("table", teacherDetailedView, {
//            "class": "table table-striped table-hover"
//        });
//
//        let tableBody = createElement("tbody", table);
//
//        let createRowValue = (label, value) => {
//            let tableBodyRow = createElement("tr", tableBody);
//            createElement("th", tableBodyRow, {innerHTML: label, style: "width: 1%; white-space: nowrap;"});
//            return  createElement("td", tableBodyRow, {innerHTML: value});
//        };
//
//        for (let key in attributeKeys)
//            createRowValue(attributeKeys[key], teacher[key]);
//
//        createRowValue("Workload, spring", teacher.workload.spring + " hours (" + Math.round(teacher.workloadNormalized.spring * 100) + "%)");
//        createRowValue("Workload, fall", teacher.workload.fall + " hours (" + Math.round(teacher.workloadNormalized.fall * 100) + "%)");
//
//        let springCoursesCell = createRowValue("Courses, spring", "");
//        let springCoursesList = createElement("ul", springCoursesCell);
//
//        for (let courseID in teacher.courses) {
//            let course = teacher.courses[courseID];
//            let courseName = course.name;
//            let listItem = createElement("li", springCoursesList);
//            let link = createElement("a", listItem, {href: "#", innerHTML: courseName});
//            link.addEventListener("click", () => {
//                self.onCourseSelected(course);
//            });
//        }
//
//        teacherOverviewDiv.style.setProperty("display", "none");
//        teacherDetailedView.style.setProperty("display", "block");
    };

    this.resetView = function() {
//        teacherDetailedView.style.setProperty("display", "none");
//        teacherOverviewDiv.style.setProperty("display", "block");
    };
}
