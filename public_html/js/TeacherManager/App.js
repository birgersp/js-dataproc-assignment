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

    let self = this;

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();
    this.dataProcessor = new TeacherManager.DataProcessor();

    function dataProcessed() {

        self.workloadBrowser.setTeacherData(self.dataProcessor.getTeachers());
    }

    this.start = function() {

        self.ui.initialize();

        self.workloadBrowser.teachers = self.dataProcessor.getTeachers();
        self.workloadBrowser.container = self.ui.getWorkloadContainer();
        self.workloadBrowser.initialize();

        self.dataProcessor.process("data/courses.csv", dataProcessed);
    };
};
