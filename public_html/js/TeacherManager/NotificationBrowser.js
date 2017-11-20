"use strict";

function TMNotificationBrowser() {

    let self = this;

    const MINIMUM_WORKLOAD_PERCENTAGE = 25;
    const MAXIMUM_WORKLOAD_PERCENTAGE = 100;

    let teacherNotificationList = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};
    this.onCourseSelected = function(course) {};

    function addTeacherNotification(teacher, notification) {

        if (teacherNotificationList.children.length == 0) {
            createElement("h4", self.container, {innerHTML: "Teachers"});
            self.container.appendChild(teacherNotificationList);
        }

        let listItem = createElement("li", teacherNotificationList);
        let link = createElement("a", listItem, {
            innerHTML: notification,
            href: "#"
        });

        link.addEventListener("click", () => {
            self.onTeacherSelected(teacher);
        });
    }

    this.initialize = function() {

        teacherNotificationList = createElement("ul");
    };

    this.processTeachers = function(teachers) {

        // TODO: generate notifications for problems with list of teachers

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];

            let name = teacher.firstName + " " + teacher.lastName;

            function checkWorkload(season) {

                if (teacher.isExternal || teacher.isStudentAssistant)
                    return;

                let workloadPercentage = Math.round(teacher.workloadNormalized[season] * 100);

                if (workloadPercentage > MAXIMUM_WORKLOAD_PERCENTAGE) {
                    let notification = name + " has a high workload during the " + season + " semester: " + workloadPercentage + "%";
                    addTeacherNotification(teacher, notification);
                }

                if (workloadPercentage < MINIMUM_WORKLOAD_PERCENTAGE) {
                    let notification = name + " has a low workload during the " + season + " semester: " + workloadPercentage + "%";
                    addTeacherNotification(teacher, notification);
                }
            }
            checkWorkload("spring");
            checkWorkload("fall");
        }
    };

    this.processCourses = function(courses) {

        // TODO: getnerate notifications for problems with list of courses
    };
}
