include("../utilities/utilities.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.DataProcessor = function() {

    let studyPrograms = {};
    let courses = {};
    let teachers = {};

    function validateDataObject(label, object) {

        let nullAttributeKeys = getNullAttributeKeys(object);
        if (nullAttributeKeys.length == 0)
            return true;

        console.log(label + " invalid, missing attribute keys are: " + nullAttributeKeys);
        return false;
    }

    function populate(samples) {

        // Iterate through samples, identify unique programs, courses and teachers
        for (let sampleI in samples) {
            let sample = samples[sampleI];

            // If program ID is unique and sample is valid, add study program
            let studyProgramID = sample["program_id"];
            if (studyPrograms[studyProgramID]) {

                let studyProgram = new TeacherManager.StudyProgram();

                studyProgram.id = studyProgramID;
                studyProgram.name = sample["program_name"];
                studyProgram.level = sample["study_level"];

                if (validateDataObject("Study Program", studyProgram))
                    studyPrograms[studyProgramID] = studyProgram;
            }

            // If course ID is unique and sample is valid, add course
            let courseID = sample["course_id"];
            if (courses[courseID] == undefined) {

                let course = new TeacherManager.Course();

                course.id = courseID;
                course.name = sample["course_name"];
                course.credits = Number(sample["course_credits"]);
                course.studyYear = Number(sample["study_year"]);
                course.mandatory = sample["mandatory_course"].toLowerCase() == "true";
                course.season = sample["spring_fall"] === "S" ? TeacherManager.Course.Season.SPRING : TeacherManager.Course.Season.FALL;
                course.numberOfStudents = Number(sample["num_students"]);
                course.teacherWorkloadHours = Number(sample["teacher_workload_hours"]);

                if (validateDataObject("Course", course))
                    courses[courseID] = course;
            }

            // If teacher ID is unique and sample is valid, add teacher
            let teacherID = sample["teacher_id"];
            if (teachers[teacherID] == undefined) {

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

                if (teacherID == "") {
                    console.log("stop!");
                }

                if (validateDataObject("Teacher", teacher))
                    teachers[teacherID] = teacher;
            }

            if (teachers[teacherID] != undefined && courses[courseID] != undefined) {
                let teacher = teachers[teacherID];
                let course = courses[courseID];
                teacher.courses[courseID] = course;
            }
        }

        console.log(teachers);
    }

    function process(samples) {
        populate(samples);
    }

    this.process = function(filename, callback) {
        requestURL(filename, function(csvString) {
            let samples = parseCSVString(csvString, "\r", ";");
            process(samples);
            callback();
        });
    };
};
