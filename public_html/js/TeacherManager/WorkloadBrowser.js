"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");
include("../thirdparty/colorconverter.js"); /* global colorconv */

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkloadBrowser = function() {

    const COLOR_ALPHA = 0.2;
    const MAX_WORKLOAD_THRESHOLD = 250;
    let self = this;

    this.container = null;

    function onChartClick(event, array) {
    }

    this.initialize = function() {
        // TODO: maybe show some warning here, "awating data"
    };

    this.setTeacherData = function(teachers) {

        self.container.innerHTML = "";

        let canvasContainer = createElement("div", self.container);
        canvasContainer.style.setProperty("max-width", "1600px");

        let springCanvas = createElement("canvas", canvasContainer);
        let fallCanvas = createElement("canvas", canvasContainer);

        let teacherNames = [];

        let springWorkloadDataValues = [];
        let springWorkloadColors = [];
        let springWorkloadBorderColors = [];

        let fallWorkloadDataValues = [];
        let fallWorkloadColors = [];
        let fallWorkloadBorderColors = [];

        function getWorkloadColorRGB(workloadPercent) {

            let factor;

            if (workloadPercent <= 100) {
                factor = workloadPercent / 100;
            } else {
                let overshoot = workloadPercent - 100;
                factor = 1 - overshoot / (MAX_WORKLOAD_THRESHOLD - 100);
            }

            if (factor < 0)
                factor = 0;

            let hue = 1 / 3 * factor;
            let rgb = colorconv.HSV2RGB([hue, 1, 0.85]);
            let rgbString = "";

            for (let i in rgb) {
                if (i > 0)
                    rgbString += ",";
                rgbString += Math.floor(rgb[i]);
            }

            return rgbString;
        }

        function getWorkloadBorderColor(workloadPercent) {

            return 'rgba(' + getWorkloadColorRGB(workloadPercent) + ',1)';
        }

        function getWorkloadColor(workloadPercent) {

            return 'rgba(' + getWorkloadColorRGB(workloadPercent) + ',' + COLOR_ALPHA + ')';
        }

        function insertAt(array, index, item) {
            array.splice(index, 0, item);
        }

        for (let teacherID in teachers) {

            let teacher = teachers[teacherID];
            let teacherName = teacher.lastName + ", " + teacher.firstName[0];

            let springWorkload = teacher.workloadPercent.spring;
            let fallWorkload = teacher.workloadPercent.fall;

            // Determine index according to first letter in name (sorting alphabetically)
            let teacherNameCharCode = teacherName.charCodeAt(0);
            let found = false;
            let index = 0;
            while (!found) {
                if (index >= teacherNames.length) {
                    index = teacherNames.length;
                    found = true;
                } else {
                    if (teacherNames[index].charCodeAt(0) > teacherNameCharCode)
                        found = true;
                    else
                        index++;
                }
            }

            // Insert data to chart datasets at index
            insertAt(teacherNames, index, teacherName);
            insertAt(springWorkloadColors, index, getWorkloadColor(springWorkload));
            insertAt(springWorkloadBorderColors, index, getWorkloadBorderColor(springWorkload));
            insertAt(springWorkloadDataValues, index, springWorkload);
            insertAt(fallWorkloadColors, index, getWorkloadColor(fallWorkload));
            insertAt(fallWorkloadBorderColors, index, getWorkloadBorderColor(fallWorkload));
            insertAt(fallWorkloadDataValues, index, fallWorkload);
        }

        function createChart(canvas, title, dataValues, dataColors, dataBorderColors) {
            new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: teacherNames,
                    datasets: [
                        {
                            data: dataValues,
                            backgroundColor: dataColors,
                            borderColor: dataBorderColors,
                            borderWidth: 1
                        }]
                },
                options: {
                    onClick: onChartClick,
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
                        text: title
                    }
                }
            });
        }

        createChart(
                springCanvas,
                "Workload, Spring",
                springWorkloadDataValues,
                springWorkloadColors,
                springWorkloadBorderColors
                );

        createChart(
                fallCanvas,
                "Workload, Fall",
                fallWorkloadDataValues,
                fallWorkloadColors,
                fallWorkloadBorderColors
                );
    };
};
