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

    const APP_TITLE = "Teacher Manager";

    const WORKLOAD_TAB_ID = "workload";
    const WORKLOAD_TAB_LABEL = "Teacher Workload";

    const TEACHERS_TAB_ID = "teachers";
    const TEACHERS_TAB_LABEL = "Teachers";

    const COURSES_TAB_ID = "courses";
    const COURSES_TAB_LABEL = "Courses";

    const INFO_TAB_ID = "info";
    const INFO_TAB_LABEL = "Info";

    const DEFAULT_ACTIVE_TAB = TEACHERS_TAB_ID;

    let self = this;

    this.ui = new TeacherManager.UserInterface();
    this.workloadBrowser = new TeacherManager.WorkloadBrowser();
    this.dataProcessor = new TeacherManager.DataProcessor();
    this.teacherBrowser = new TeacherManager.TeacherBrowser();

    let tabs = {
        workload: null,
        teachers: null
    };

    function dataProcessed() {

        let teachers = self.dataProcessor.getTeachers();
        self.workloadBrowser.setTeacherData(teachers);
        self.teacherBrowser.setTeacherData(teachers);
    }

    this.start = function() {

        self.ui.appTitle = APP_TITLE;
        self.ui.initialize();

        tabs.workload = self.ui.createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        tabs.teachers = self.ui.createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);

        tabs.teachers.open();

        self.workloadBrowser.container = tabs.workload.container;
        self.teacherBrowser.container = tabs.teachers.container;
        self.ui.createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);
        self.ui.createTab(INFO_TAB_ID, INFO_TAB_LABEL);

        self.workloadBrowser.initialize();
        self.teacherBrowser.initialize();

        self.dataProcessor.process("data/courses.csv", dataProcessed);
    };
};
