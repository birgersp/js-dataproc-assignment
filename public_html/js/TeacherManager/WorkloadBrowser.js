"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");
include("../thirdparty/colorconverter.js"); /* global colorconv */

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
        canvasContainer.style.setProperty("max-width", "1600px");

        let canvas = createElement("canvas", canvasContainer);

        let teacherNames = [];

        let springWorkloadDataValues = [];
        let springWorkloadColors = [];
        let springWorkloadBorderColors = [];

        function getWorkloadColorRGB(workloadPercent) {

            let hue = 1 / 3;

            let rgb = colorconv.HSV2RGB([hue, 1, 1]);
            console.log(rgb);

            let rgbString = "" + rgb;
            return rgbString;
        }

        function getWorkloadBorderColor(workloadPercent) {

            let alpha = 1;
            let rgbaString = 'rgba(' + getWorkloadColorRGB(workloadPercent) + ',' + alpha + ')';
            return rgbaString;
        }

        function getWorkloadColor(workloadPercent) {

            let alpha = 0.3;
            let rgbaString = 'rgba(' + getWorkloadColorRGB(workloadPercent) + ',' + alpha + ')';
            return rgbaString;
        }

        for (let teacherID in teachers) {

            let teacher = teachers[teacherID];
            let teacherName = teacher.lastName + ", " + teacher.firstName[0];

            teacherNames.push(teacherName);

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
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Workload, Spring"
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
