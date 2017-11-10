"use strict";

if (!window.TeacherManager)
    window.TeacherManager = {};

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
};

TMCourse.Season = {
    SPRING: 1,
    FALL: 2
};
