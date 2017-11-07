"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkloadBrowser = function() {

    let self = this;

    this.container = null;

    function onChartClick(event, array) {

    }

    this.initialize = function() {


    };

    this.setTeacherData = function(teachers) {

        self.container.innerHTML = "";

        let canvasContainer = createElement("div", self.container);
        canvasContainer.style.setProperty("max-width", "1200px");

        let canvas = createElement("canvas", canvasContainer);

        let teacherNames = [];

        let springWorkloadDataValues = [];
        let springWorkloadColors = [];
        let springWorkloadBorderColors = [];

        function getWorkloadBorderColor(workloadPercent) {
            return 'rgba(255, 206, 86, 1)';
        }

        function getWorkloadColor(workloadPercent) {
            return 'rgba(255, 206, 86, 0.5)';
        }

        for (let teacherID in teachers) {

            let teacher = teachers[teacherID];
            teacherNames.push(teacher.lastName);

            let workloadPercent = teacher.workloadPercent.spring;

            springWorkloadColors.push(getWorkloadColor(workloadPercent));
            springWorkloadBorderColors.push(getWorkloadBorderColor(workloadPercent));

            springWorkloadDataValues.push(workloadPercent);
        }

        let chartOptions = {
            onClick: onChartClick(),
            scales: {
                xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value + "%";
                            }
                        }
                    }]
            }
        };

        new Chart(canvas, {
            type: 'horizontalBar',
            data: {
                labels: teacherNames,
                datasets: [
                    {
                        data: springWorkloadDataValues,
                        backgroundColor: springWorkloadColors,
                        borderColor: springWorkloadBorderColors,
                        borderWidth: 1
                    }]
            },
            options: chartOptions
        });
    };
};
