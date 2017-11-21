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

    /** @type {TMDataValidator} */
    this.dataValidator = null;

    this.initialize = function() {

        let attributeHeaders = [];
        for (let attributeKey in courseAttributeKeys)
            attributeHeaders.push(courseAttributeKeys[attributeKey]);

        attributeHeaders.push("Coverage");

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

            listBrowser.addListRow(courseID);

            courses[courseID] = course;

            for (let attributeKey in courseAttributeKeys) {

                let value = course[attributeKey];

                let key = courseAttributeKeys[attributeKey];
                if (key === courseAttributeKeys.season) {
                    value = value == TMCourse.Season.SPRING ? "Spring" : "Fall";
                }
                listBrowser.addListValue(value);
            }

            let coverage = self.dataValidator.getCourseCoverage(course);
            listBrowser.addListValue(coverage, !self.dataValidator.validateCourseCoverage(course));
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

        let coveringTeachers = [];
        for (let teacherID in course.teachingCoveredPercent) {
            let teacher = teachers[teacherID];
            if (!teacher)
                throw "Could not find teacher " + teacherID;

            coveringTeachers.push(teacher);
        }

        let remarks = [];

        if (coveringTeachers.length > 0) {
            let coverageCell = listBrowser.createDetail("Teachers");
            let list = createElement("ul", coverageCell);

            for (let teacherIndex in coveringTeachers) {
                let teacher = coveringTeachers[teacherIndex];
                let entry = teacher.firstName + " " + teacher.lastName + " (";
                if (teacher.isStudentAssistant)
                    entry += "assistant, ";
                entry += course.teachingCoveredPercent[teacher.id] + "%)";

                let item = createElement("li", list);
                let link = createElement("a", item, {
                    href: "#",
                    innerHTML: entry
                });
                link.addEventListener("click", () => {
                    self.onTeacherSelected(teacher);
                });
            }

            if (!self.dataValidator.courseCoverageAboveThreshold(course)) {
                remarks.push("Coverage is too high (" + self.dataValidator.getCourseCoverage(course) + "%)");
            } else
            if (!self.dataValidator.courseCoverageBelowThreshold(course)) {
                remarks.push("Coverage is too low (" + self.dataValidator.getCourseCoverage(course) + "%)");
            }
        } else
            remarks.push("No teachers covering this course");

        if (remarks.length > 0) {
            let cell = listBrowser.createDetail("Remarks");
            let list = createElement("ul", cell);

            for (let remarkI in remarks) {
                let remark = remarks[remarkI];
                createElement("li", list, {innerHTML: remark, style: "color:red;"});
            }
        }

        listBrowser.enableDetailView();
    };

    this.resetView = function() {

        listBrowser.disableDetailView();
    };
}

