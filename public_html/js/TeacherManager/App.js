"use strict";

include("UserInterface.js");
include("WorkloadBrowser.js");
include("DataProcessor.js");

include("StudyProgram.js");
include("Course.js");
include("Teacher.js");
include("TeacherBrowser.js");
include("NotificationBrowser.js");
include("CourseBrowser.js");
include("DataValidator.js");

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
    this.courseBrowser = new TMCourseBrowser();

    let dataValidator = new TMDataValidator();

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
        self.courseBrowser.addTeachers(teachers);
        self.notificationsBrowser.addTeachers(teachers);

        let courses = self.dataProcessor.getCourses();
        self.courseBrowser.addCourses(courses);
        self.notificationsBrowser.addCourses(courses);

        self.notificationsBrowser.processTeachers(teachers);
        self.notificationsBrowser.processCourses(courses);
    }

    function selectTeacher(teacher) {

        tabs.teachers.open();
        self.teacherBrowser.showTeacherDetails(teacher);
    }

    function selectCourse(course) {

        tabs.courses.open();
        self.courseBrowser.showCourseDetails(course);
    }

    this.start = function() {

        self.ui.appTitle = APP_TITLE;
        self.ui.initialize();

        // Setup workload browser
        tabs.workload = self.ui.createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        self.workloadBrowser.onTeacherSelected = selectTeacher;
        self.workloadBrowser.container = tabs.workload.container;
        self.workloadBrowser.dataValidator = dataValidator;
        self.workloadBrowser.initialize();

        // Setup teacher browsing tab
        tabs.teachers = self.ui.createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);
        tabs.teachers.onOpen = () => {
            self.teacherBrowser.resetView();
        };
        self.teacherBrowser.onCourseSelected = selectCourse;
        self.teacherBrowser.container = tabs.teachers.container;
        self.teacherBrowser.dataValidator = dataValidator;
        self.teacherBrowser.initialize();

        // Setup course browsing tab
        tabs.courses = self.ui.createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);
        tabs.courses.onOpen = () => {
            self.courseBrowser.resetView();
        };
        self.courseBrowser.onTeacherSelected = selectTeacher;
        self.courseBrowser.container = tabs.courses.container;
        self.courseBrowser.dataValidator = dataValidator;
        self.courseBrowser.initialize();

        // Setup info tab
        tabs.info = self.ui.createTab(NOTIFICATIONS_TAB_ID, NOTIFICATIONS_TAB_LABEL);
        self.notificationsBrowser.container = tabs.info.container;
        self.notificationsBrowser.onTeacherSelected = selectTeacher;
        self.notificationsBrowser.onCourseSelected = selectCourse;
        self.notificationsBrowser.dataValidator = dataValidator;
        self.notificationsBrowser.initialize();

        self.dataProcessor.loadSemesterHours("data/hours.csv", () => {
            self.dataProcessor.loadCoursesDataset("data/courses.csv", dataProcessed);
        });
    };
}
