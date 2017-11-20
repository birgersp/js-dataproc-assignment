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

    this.container = null;

    this.initialize = function() {

        let attributeHeaders = [];
        for (let attributeKey in courseAttributeKeys)
            attributeHeaders.push(courseAttributeKeys[attributeKey]);

        listBrowser.container = self.container;
        listBrowser.initialize();
        listBrowser.addList(null, attributeHeaders);
    };

    this.addCourses = function(newCourses) {

        for (let courseID in newCourses) {
            let course = newCourses[courseID];

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

    this.showCourseDetails = function(course) {

        listBrowser.clearDetails();


    };
}

