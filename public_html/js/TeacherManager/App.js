"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("DataProcessor.js");

include("StudyProgram.js");
include("Course.js");
include("Teacher.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.App = function() {

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();
    this.dataProcessor = new TeacherManager.DataProcessor();

    function dataProcessed() {

    }

    this.handleEvent = function(event) {

    };

    this.start = function() {

        this.workloadBrowser.eventHandler = this;
        this.workloadBrowser.initialize();
        this.ui.initialize();

        this.dataProcessor.process("data/courses.csv", dataProcessed);
    };
};
