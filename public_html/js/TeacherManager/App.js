"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("DataProcessor.js");

include("StudyProgram.js");
include("Course.js");
include("Teacher.js");
include("TeacherBrowser.js");
include("NotificationBrowser.js");

function TMApp() {

    const APP_TITLE = "Teacher Manager";

    const WORKLOAD_TAB_ID = "workload";
    const WORKLOAD_TAB_LABEL = "Teacher Workload";

    const TEACHERS_TAB_ID = "teachers";
    const TEACHERS_TAB_LABEL = "Teachers";

    const COURSES_TAB_ID = "courses";
    const COURSES_TAB_LABEL = "Courses";

    const NOTIFICATIONS_TAB_ID = "info";
    const NOTIFICATIONS_TAB_LABEL = "Info";

    const DEFAULT_ACTIVE_TAB = TEACHERS_TAB_ID;

    let self = this;

    this.ui = new TMUserInterface();
    this.workloadBrowser = new TMWorkloadBrowser();
    this.dataProcessor = new TMDataProcessor();
    this.teacherBrowser = new TMTeacherBrowser();
    this.notificationsBrowser = new TMNotificationBrowser();

    let tabs = {
        workload: null,
        teachers: null,
        courses: null,
        info: null
    };

    function dataProcessed() {

        let teachers = self.dataProcessor.getTeachers();
        self.workloadBrowser.setTeacherData(teachers);
        self.teacherBrowser.addTeachers(teachers);
        self.notificationsBrowser.processTeachers(teachers);

        let courses = self.dataProcessor.getCourses();
        // TODO: set courses data for courses browser
        self.notificationsBrowser.processCourses(courses);
    }

    function selectTeacher(teacher) {
        tabs.teachers.open();
        self.teacherBrowser.showTeacherDetails(teacher);
    }

    function selectCourse(course) {
        // TODO: show course details
        console.log(course);
    }

    this.start = function() {

        self.ui.appTitle = APP_TITLE;
        self.ui.initialize();

        // Setup workload browser
        tabs.workload = self.ui.createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        self.workloadBrowser.onTeacherSelected = selectTeacher;
        self.workloadBrowser.container = tabs.workload.container;
        self.workloadBrowser.initialize();

        // Setup teacher browser tab
        tabs.teachers = self.ui.createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);
        tabs.teachers.onOpen = function() {
            self.teacherBrowser.resetView();
        };
        self.teacherBrowser.onCourseSelected = selectCourse;
        self.teacherBrowser.container = tabs.teachers.container;
        self.teacherBrowser.initialize();

        self.ui.createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);

        tabs.info = self.ui.createTab(NOTIFICATIONS_TAB_ID, NOTIFICATIONS_TAB_LABEL);
        self.notificationsBrowser.container = tabs.info.container;
        self.notificationsBrowser.onTeacherSelected = selectTeacher;
        self.notificationsBrowser.initialize();

        self.dataProcessor.loadSemesterHours("data/hours.csv", () => {
            self.dataProcessor.loadCoursesDataset("data/courses.csv", dataProcessed);
        });

        tabs.teachers.open();
    };
}
