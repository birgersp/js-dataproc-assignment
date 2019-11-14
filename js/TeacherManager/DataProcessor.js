"use strict";

include("../utilities/utilities.js");

/**
 * Creates an instance to load and process information about courses and teachers
 * @returns {TMDataProcessor}
 */
function TMDataProcessor() {

    let studyPrograms = {};
    let courses = {};
    let teachers = {};

    let semesterHours = {
        spring: 0,
        fall: 0
    };

    /**
     * Iterates through samples and adds unique courses and teachers to the data processor
     * @param {Object[]} samples
     */
    function populate(samples) {

        // Iterate through samples, identify unique programs, courses and teachers
        for (let sampleI in samples) {
            let sample = samples[sampleI];

            // If program ID is unique and sample is valid, add study program
            let studyProgramID = sample["program_id"];
            if (studyProgramID != "" && studyPrograms[studyProgramID]) {

                let studyProgram = new TMStudyProgram();

                studyProgram.id = studyProgramID;
                studyProgram.name = sample["program_name"];
                studyProgram.level = sample["study_level"];

                studyPrograms[studyProgramID] = studyProgram;
            }

            // If course ID is unique and sample is valid, add course
            let courseID = sample["course_id"];
            if (courseID != "" && courses[courseID] == undefined) {

                let course = new TMCourse();

                course.id = courseID;
                course.name = sample["course_name"];
                course.credits = Number(sample["course_credits"]);
                course.studyYear = Number(sample["study_year"]);
                course.mandatory = sample["mandatory_course"].toLowerCase() == "true";
                course.season = sample["spring_fall"] === "S" ? TMCourse.Season.SPRING : TMCourse.Season.FALL;
                course.numberOfStudents = Number(sample["num_students"]);
                course.teacherWorkloadHours = Number(sample["teacher_workload_hours"]);

                courses[courseID] = course;
            }

            // If teacher ID is unique and sample is valid, add teacher
            let teacherID = sample["teacher_id"];
            if (teacherID != "" && teachers[teacherID] == undefined) {

                let teacher = new TMTeacher();

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

                if (course.teachingCoveredPercent[teacherID] == undefined)
                    course.teachingCoveredPercent[teacherID] = 0;
                course.teachingCoveredPercent[teacherID] += Number(sample["percent_course"]);
            }
        }
    }

    /**
     * Iterates through samples to compute the workload of each teacher
     * @param {Object[]} samples
     */
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

            let courseWorkload = Number(sample["teacher_workload_hours"]);
            let teacherCoursePercentage = Number(sample["percent_course"]);
            let teacherCourseWorkload = courseWorkload * (teacherCoursePercentage / 100);
            if (course.season == TMCourse.Season.SPRING) {
                teacher.workload.spring += teacherCourseWorkload;
            } else {
                teacher.workload.fall += teacherCourseWorkload;
            }
        }

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];
            teacher.workload.spring = Math.round(teacher.workload.spring);
            teacher.workload.fall = Math.round(teacher.workload.fall);
        }
    }

    /**
     * Iterates through the teachers, to compute the normalized workload of each
     */
    function setTeacherWorkloadNormalized() {

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];

            let employmentFactor = teacher.employmentPercentage / 100;

            let targetWorkloadSpring = employmentFactor * semesterHours.spring;
            let targetWorkloadFall = employmentFactor * semesterHours.fall;

            if (targetWorkloadSpring > 0)
                teacher.workloadNormalized.spring = teacher.workload.spring / targetWorkloadSpring;
            else
                teacher.workloadNormalized.spring = 0;

            if (targetWorkloadFall > 0)
                teacher.workloadNormalized.fall = teacher.workload.fall / targetWorkloadFall;
            else
                teacher.workloadNormalized.fall = 0;
        }
    }

    /**
     * Adds information about teachers and courses from an array of samples
     * @param {Object[]} samples
     */
    function loadCoursesDataset(samples) {
        populate(samples);
        addTeacherWorkload(samples);
        setTeacherWorkloadNormalized();
    }

    /**
     * Loads a dataset containing information about courses, invokes a callback when the data is loaded
     * Expects the file to be a character-separated-values (.csv), where entries are separated by a carriage-return (\r) while values are separated by a semicolon (;)
     * @param {String} filename
     * @param {Function} callback
     */
    this.loadCoursesDataset = function(filename, callback) {
        requestURL(filename, function(csvString) {
            let samples = parseCSVString(csvString, "\r", ";");
            loadCoursesDataset(samples);
            callback();
        });
    };

    /**
     * Loads a dataset containing information about hours per semester, invokes a callback when the data is loaded
     * Expects the file to be a character-separated-values (.csv), where entries are separated by a carriage-return (\r) while values are separated by a semicolon (;)
     * @param {String} filename
     * @param {Function} callback
     */
    this.loadSemesterHours = function(filename, callback) {
        requestURL(filename, (string) => {
            let samples = parseCSVString(string, "\r", ";");

            for (let sampleI in samples) {
                let sample = samples[sampleI];
                let hours = Number(sample.hours);

                if (sample.semester == "Fall") {
                    semesterHours.fall = hours;
                } else //
                if (sample.semester == "Spring") {
                    semesterHours.spring = hours;
                }
            }

            callback();
        });
    };

    /**
     * Returns an object where each attribute is a study program (the attribute key is the ID of the program)
     * @returns {Object}
     */
    this.getStudyPrograms = function() {
        return studyPrograms;
    };

    /**
     * Returns an object where each attribute is a course (attribute key is course ID)
     * @returns {Object}
     */
    this.getCourses = function() {
        return courses;
    };

    /**
     * Returns an object where each attribute is a teacher (attribute key is teacher ID)
     * @returns {Object}
     */
    this.getTeachers = function() {
        return teachers;
    };
}
