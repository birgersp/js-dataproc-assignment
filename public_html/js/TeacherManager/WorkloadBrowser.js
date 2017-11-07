"use strict";

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkloadBrowser = function() {

    let self = this;

    this.container = null;
    this.teachers = null;

    this.initialize = function() {

        self.container.innerHTML = "Initializing";
//        let canvas = 
    };

    this.update = function() {

        console.log(self.teachers);

        // TODO: generate chart(s)
    };
};
