"use strict";

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.Teacher = function() {

    this.id = null;
    this.firstName = null;
    this.lastName = null;
    this.facultyCode = null;
    this.departmentCode = null;
    this.isExternal = null;
    this.employmentPercentage = null;
    this.isStudentAssistant = null;

    this.workload = {
        spring: 0,
        fall: 0
    };
    this.courses = {};
};
