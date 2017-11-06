"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("../utilities/utilities.js");

include("Course.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.App = function () {

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();

    function processData(samples) {

        console.log(samples[0]);

        // Courses (indexed by ID)
        let courses = {};

        for (let sampleI in samples) {

            let sample = samples[sampleI];

            // If course ID is unique and sample is valid, add course
            let courseID = sample["course_id"];
            if (courses[courseID] == undefined)
            {
                let course = new TeacherManager.Course();
                course.id = sample["course_id"];
                course.name = sample["course_name"];
                course.credits = Number(sample["course_credits"]);
                course.studyYear = Number(sample["study_year"]);
                course.mandatory = sample["mandatory_course"].toLowerCase() == "true" ? true : false;
                course.season = sample["spring_fall"] === "S" ? TeacherManager.Course.Season.SPRING : TeacherManager.Course.Season.FALL;
                course.numberOfStudents = Number(sample["num_students"]);
                course.teacherWorkloadHours = Number(sample["teacher_workload_hours"]);
                if (course.isValid())
                    courses[courseID] = course;
                else
                    console.log("Rejected course entry: " + sample);
            }

            // If teacher ID is unique and sample is valid, add teacher
        }
    }

    this.handleEvent = function (event) {

    };

    this.start = function () {

        requestURL("data/courses.csv", function (csvString) {
            let samples = parseCSVString(csvString, "\r", ";");
            processData(samples);
        });

        this.workloadBrowser.eventHandler = this;
        this.workloadBrowser.initialize();
        this.ui.initialize();
    };
};
