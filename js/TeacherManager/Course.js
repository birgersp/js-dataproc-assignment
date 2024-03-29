"use strict";

/**
 * Creates a course instance
 * @returns {TMCourse}
 */
function TMCourse() {

    // ID
    this.id = null;

    // Name
    this.name = null;

    // Number of credits
    this.credits = null;

    // Programme study year
    this.studyYear = null;

    // Is mandatory
    this.mandatory = null;

    // Season
    this.season = null;

    // Number of students
    this.numberOfStudents = null;

    // Allocated teacher hours
    this.teacherWorkloadHours = null;

    // Map of teacher (IDs) and number of hours covered by that teacher
    this.teachingCoveredPercent = {};
}

/**
 * Defines two different season that a course can be held
 */
TMCourse.Season = {
    SPRING: "spring",
    FALL: "fall"
};
