"use strict";

include("../utilities/utilities.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.DataProcessor = function() {

    let studyPrograms = {};
    let courses = {};
    let teachers = {};

    function populate(samples) {

        // Iterate through samples, identify unique programs, courses and teachers
        for (let sampleI in samples) {
            let sample = samples[sampleI];

            // If program ID is unique and sample is valid, add study program
            let studyProgramID = sample["program_id"];
            if (studyProgramID != "" && studyPrograms[studyProgramID]) {

                let studyProgram = new TeacherManager.StudyProgram();

                studyProgram.id = studyProgramID;
                studyProgram.name = sample["program_name"];
                studyProgram.level = sample["study_level"];

                studyPrograms[studyProgramID] = studyProgram;
            }

            // If course ID is unique and sample is valid, add course
            let courseID = sample["course_id"];
            if (courseID != "" && courses[courseID] == undefined) {

                let course = new TeacherManager.Course();

                course.id = courseID;
                course.name = sample["course_name"];
                course.credits = Number(sample["course_credits"]);
                course.studyYear = Number(sample["study_year"]);
                course.mandatory = sample["mandatory_course"].toLowerCase() == "true";
                course.season = sample["spring_fall"] === "S" ? TeacherManager.Course.Season.SPRING : TeacherManager.Course.Season.FALL;
                course.numberOfStudents = Number(sample["num_students"]);
                course.teacherWorkloadHours = Number(sample["teacher_workload_hours"]);

                courses[courseID] = course;
            }

            // If teacher ID is unique and sample is valid, add teacher
            let teacherID = sample["teacher_id"];
            if (teacherID != "" && teachers[teacherID] == undefined) {

                let teacher = new TeacherManager.Teacher();

                teacher.id = teacherID;
                teacher.firstName = sample["teacher_firstname"];
                teacher.lastName = sample["teacher_lastname"];
                teacher.isExternal = sample["is_external"].toLowerCase() == "true";
                if (teacher.isExternal) {
                    teacher.facultyCode = "";
                    teacher.departmentCode = "";
                } else {
                    teacher.facultyCode = sample["faculty_code"];
                    teacher.departmentCode = sample["department_code"];
                }
                teacher.employmentPercentage = Number(sample["percent_employed"]);
                teacher.isStudentAssistant = sample["is_studass"].toLowerCase() == "true";
                teacher.courses = {};

                teachers[teacherID] = teacher;
            }

            // Add course to teacher
            if (teachers[teacherID] != undefined && courses[courseID] != undefined) {
                let teacher = teachers[teacherID];
                let course = courses[courseID];
                teacher.courses[courseID] = course;
            }
        }
    }

    function addTeacherWorkload(samples) {

        // Iterate through samples, identify unique programs, courses and teachers
        for (let sampleI in samples) {
            let sample = samples[sampleI];

            let courseID = sample["course_id"];
            if (courseID == "")
                continue;

            let course = courses[courseID];
            if (course == undefined)
                throw "Course " + courseID + " is missing from the register";

            let teacherID = sample["teacher_id"];
            if (teacherID == "")
                continue;

            let teacher = teachers[teacherID];
            if (teacher == undefined)
                throw "Teacher " + teacherID + " is missing from the register";

            let sampleWorkloadPercent = Number(sample["percent_course"]);
            if (course.season == TeacherManager.Course.Season.SPRING)
                teacher.workloadPercent.spring += sampleWorkloadPercent;
            else
                teacher.workloadPercent.fall += sampleWorkloadPercent;
        }
    }

    function process(samples) {
        populate(samples);
        addTeacherWorkload(samples);
    }

    this.process = function(filename, callback) {
        requestURL(filename, function(csvString) {
            let samples = parseCSVString(csvString, "\r", ";");
            process(samples);
            callback();
        });
    };

    this.getStudyPrograms = function() {
        return studyPrograms;
    };

    this.getCourses = function() {
        return courses;
    };

    this.getTeachers = function() {
        return teachers;
    };
};
