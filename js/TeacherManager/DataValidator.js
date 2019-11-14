"use strict";

/**
 * Creates an instance to validate teachers and courses
 * @returns {TMDataValidator}
 */
function TMDataValidator() {

    let self = this;

    this.minimumWorkloadPercent = 25;
    this.maximumWorkloadPercent = 100;

    /**
     * Returns a value (percentage) indicating how much of a course is covered by teachers
     * @param {TMCourse} course
     * @returns {Number}
     */
    this.getCourseCoverage = function(course) {

        let coverage = 0;
        for (let teacherID in course.teachingCoveredPercent)
            coverage += course.teachingCoveredPercent[teacherID];
        return coverage;
    };

    /**
     * Validates whether the workload of a teacher for a specific season is above a minimum threshold
     * @param {TMTeacher} teacher
     * @param {TMCourse.Season} season
     * @returns {Boolean}
     */
    this.teacherHasWorkloadAboveThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 < self.minimumWorkloadPercent)
                return false;

        return true;
    };

    /**
     * Validates whether the workload of a teacher for a specific season is below a maximum threshold
     * @param {type} teacher
     * @param {type} season
     * @returns {Boolean}
     */
    this.teacherHasWorkloadBelowThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 > self.maximumWorkloadPercent)
                return false;

        return true;

    };

    /**
     * Performs a number of checks on a teacher object to validate it
     * @param {TMTeacher} teacher
     * @returns {Boolean}
     */
    this.validateTeacher = function(teacher) {

        if (teacher.isExternal || teacher.isStudentAssistant)
            return true;

        if (!self.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.FALL))
            return false;

        if (!self.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.FALL))
            return false;

        return true;
    };

    /**
     * Validates whether a course is covered above a minimum threshold (0%)
     * @param {type} course
     * @returns {Boolean}
     */
    this.courseCoverageAboveThreshold = function(course) {

        return self.getCourseCoverage(course) > 0;
    };

    /**
     * Validates whether a course is covered below a maximum threshold (100%)
     * @param {TMCourse} course
     * @returns {Boolean}
     */
    this.courseCoverageBelowThreshold = function(course) {

        return self.getCourseCoverage(course) == 100;
    };

    /**
     * Performs multiple checks to validate a course
     * @param {TMCourse} course
     * @returns {Boolean}
     */
    this.validateCourseCoverage = function(course) {

        if (!self.courseCoverageAboveThreshold(course))
            return false;

        if (!self.courseCoverageBelowThreshold(course))
            return false;

        return true;
    };
}
