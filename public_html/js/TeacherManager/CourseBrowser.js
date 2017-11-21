include("ListBrowser.js");

function TMCourseBrowser() {

    let self = this;

    let listBrowser = new TMListBrowser();

    let courseAttributeKeys = {
        id: "ID",
        name: "Name",
        credits: "Credits",
        studyYear: "Study Year",
        mandatory: "Is mandatory",
        season: "Season",
        numberOfStudents: "Number of Students",
        teacherWorkloadHours: "Teacher Workload Hours"
    };

    let courses = {};
    let teachers = {};

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    this.initialize = function() {

        let attributeHeaders = [];
        for (let attributeKey in courseAttributeKeys)
            attributeHeaders.push(courseAttributeKeys[attributeKey]);

        listBrowser.container = self.container;
        listBrowser.itemSelected = (id) => {
            let course = courses[id];
            self.showCourseDetails(course);
        };
        listBrowser.initialize();
        listBrowser.addList(null, attributeHeaders);
    };

    this.addCourses = function(newCourses) {

        let sortedCourses = [];
        for (let courseID in newCourses) {
            let course = newCourses[courseID];

            // Determine index according to first letter in name (sorting alphabetically)
            let courseNameCharCode = course.name.charCodeAt(0);
            let found = false;
            let index = 0;
            while (!found) {
                if (index >= sortedCourses.length) {
                    index = sortedCourses.length;
                    found = true;
                } else {
                    if (sortedCourses[index].name.charCodeAt(0) > courseNameCharCode)
                        found = true;
                    else
                        index++;
                }
            }
            sortedCourses.splice(index, 0, course);
        }

        for (let courseIndex in sortedCourses) {
            let course = sortedCourses[courseIndex];
            let courseID = course.id;

            courses[courseID] = course;

            let attributeValues = [];
            for (let attributeKey in courseAttributeKeys) {

                let value = course[attributeKey];

                let key = courseAttributeKeys[attributeKey];
                if (key === courseAttributeKeys.season) {
                    value = value == TMCourse.Season.SPRING ? "Spring" : "Fall";
                }
                attributeValues.push(value);
            }

            listBrowser.addListItem(courseID, attributeValues);
        }
    };

    this.addTeachers = function(newTeachers) {

        for (let teacherID in newTeachers) {
            teachers[teacherID] = newTeachers[teacherID];
        }
    };

    this.showCourseDetails = function(course) {

        listBrowser.clearDetails();

        for (let attributeKey in courseAttributeKeys) {

            let value = course[attributeKey];
            let key = courseAttributeKeys[attributeKey];
            if (key === courseAttributeKeys.season) {
                value = value == TMCourse.Season.SPRING ? "Spring" : "Fall";
            }

            listBrowser.addDetail(key, value);
        }

        let coverageCell = listBrowser.createDetail("Teachers");
        let list = createElement("ul", coverageCell);
        for (let teacherID in course.teachingCoveredPercent) {
            let teacher = teachers[teacherID];
            if (!teacher)
                throw "Could not find teacher " + teacherID;

            let entry = teacher.firstName + " " + teacher.lastName + " (";
            if (teacher.isStudentAssistant)
                entry += "assistant, ";
            entry += course.teachingCoveredPercent[teacherID] + "%)";
            let item = createElement("li", list);
            let link = createElement("a", item, {
                href: "#",
                innerHTML: entry
            });
            link.addEventListener("click", () => {
                self.onTeacherSelected(teacher);
            });
        }

        listBrowser.enableDetailView();
    };

    this.resetView = function() {

        listBrowser.disableDetailView();
    };
}

