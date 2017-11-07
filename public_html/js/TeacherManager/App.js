"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("DataProcessor.js");

include("StudyProgram.js");
include("Course.js");
include("Teacher.js");
include("TeacherBrowser.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.App = function() {

    let self = this;

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();
    this.dataProcessor = new TeacherManager.DataProcessor();
    this.teacherBrowser = new TeacherManager.TeacherBrowser();

    function dataProcessed() {

        let teachers = self.dataProcessor.getTeachers();
        self.workloadBrowser.setTeacherData(teachers);
        self.teacherBrowser.setTeacherData(teachers);
    }

    this.start = function() {

        self.ui.initialize();

        self.workloadBrowser.container = self.ui.getWorkloadContainer();
        self.workloadBrowser.initialize();

        self.teacherBrowser.container = self.ui.getTeacherContainer();
        self.teacherBrowser.initialize();

        self.dataProcessor.process("data/courses.csv", dataProcessed);
    };
};
