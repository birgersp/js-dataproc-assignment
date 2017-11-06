"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("../utilities/utilities.js");

include("Course.js");
include("Teacher.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.App = function () {

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();

    function processData(samples) {

        console.log(JSON.stringify(samples[0], null, 2));

        // Courses (indexed by ID)
        let courses = {};

        // Teachers (indexed by ID)
        let teachers = {};

        for (let sampleI in samples) {

            let sample = samples[sampleI];

            // If course ID is unique and sample is valid, add course
            let courseID = sample["course_id"];
            if (courses[courseID] == undefined) {

                let course = new TeacherManager.Course();

                course.id = sample["course_id"];
                course.name = sample["course_name"];
                course.credits = Number(sample["course_credits"]);
                course.studyYear = Number(sample["study_year"]);
                course.mandatory = sample["mandatory_course"].toLowerCase() == "true" ? true : false;
                course.season = sample["spring_fall"] === "S" ? TeacherManager.Course.Season.SPRING : TeacherManager.Course.Season.FALL;
                course.numberOfStudents = Number(sample["num_students"]);
                course.teacherWorkloadHours = Number(sample["teacher_workload_hours"]);

                if (!hasNullAttributes(course))
                    courses[courseID] = course;
                else {
                    console.log("Rejected course entry:");
                    console.log(sample);
                }
            }

            // If teacher ID is unique and sample is valid, add teacher
            let teacherID = sample["teacher_id"];
            if (teachers[teacherID] == undefined) {

                let teacher = new TeacherManager.Teacher();

                teacher.id = sample["teacher_id"];
                teacher.firstName = sample["teacher_firstname"];
                teacher.lastName = sample["teacher_lastname"];
                teacher.facultyCode = sample["teacher_faculty"];

                if (!hasNullAttributes(teacher))
                    teachers[teacherID] = teacher;
                else {
                    console.log("Rejected teacher entry:");
                    console.log(sample);
                }
            }
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
