"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");
include("../thirdparty/colorconverter.js"); /* global colorconv */

include("OptionsDropdown.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkloadBrowser = function() {

    const COLOR_ALPHA = 0.2;

    // Reduce overloaded teacher "redness" with this factor, higher value means higher overload will be ok (greener)
    const OVERLOAD_ERROR_REDUCTION = 1.0;

    let self = this;

    let sortedTeachers = [];
    let warningHeader = null;

    let options = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    function onSeasonChartClicked(event, array) {
        if (array[0]) {
            let teacher = sortedTeachers[array[0]._index];
            self.onTeacherSelected(teacher);
        }
    }

    function update() {

        // TODO: modify view according to options
        console.log(self.options);
    }

    this.initialize = function() {

        let dropdown = new TeacherManager.OptionsDropdown(self.container);
        self.options = dropdown.getOptions();
        dropdown.onChange = update;

        dropdown.addOption("splitSeasons", "Split by seasons", false);
        dropdown.addOption("showStudAss", "Show stud.ass.", true);
        dropdown.addOption("showExternal", "Show external", true);

        warningHeader = createElement("h4", self.container, {innerHTML: "Loading workload data..."});
    };

    this.setTeacherData = function(teachers) {

        warningHeader.parentNode.removeChild(warningHeader);

        let seasonChartsCanvasContainer = createElement("div", self.container);
        seasonChartsCanvasContainer.style.setProperty("max-width", "1600px");

        let springCanvas = createElement("canvas", seasonChartsCanvasContainer);
        let fallCanvas = createElement("canvas", seasonChartsCanvasContainer);

        let teacherNames = [];

        let springWorkloadDataValues = [];
        let springWorkloadColors = [];
        let springWorkloadBorderColors = [];

        let fallWorkloadDataValues = [];
        let fallWorkloadColors = [];
        let fallWorkloadBorderColors = [];

        let maxWorkload = 0;

        function getWorkloadColorRGB(workload, employment) {

            // Factor defines how "correct" the workload is according to the employment
            let correctness;

            // If workload is too low, decrease factor with higher workload
            if (workload <= employment) {

                correctness = workload / employment;

            }
            // If workload is too high, increase factor with higher workload
            else {

                // 0 employment yields high factor
                if (employment == 0)
                    correctness = 1;
                else {
                    // Increase factor with higher workload
                    correctness = 1 - (workload - employment) / employment / OVERLOAD_ERROR_REDUCTION;
                }
            }

            if (correctness < 0)
                correctness = 0;

            let hue = 1 / 3 * correctness;
            let rgb = colorconv.HSV2RGB([hue, 1, 0.85]);
            let rgbString = "";

            for (let i in rgb) {
                if (i > 0)
                    rgbString += ",";
                rgbString += Math.floor(rgb[i]);
            }

            return rgbString;
        }

        function getWorkloadBorderColor(workloadPercent, employment) {

            return 'rgba(' + getWorkloadColorRGB(workloadPercent, employment) + ',1)';
        }

        function getWorkloadColor(workloadPercent, employment) {

            return 'rgba(' + getWorkloadColorRGB(workloadPercent, employment) + ',' + COLOR_ALPHA + ')';
        }

        function insertAt(array, index, item) {
            array.splice(index, 0, item);
        }

        for (let teacherID in teachers) {

            let teacher = teachers[teacherID];
            let teacherName = teacher.lastName + ", " + teacher.firstName[0];

            let springWorkload = teacher.workloadPercent.spring;
            let fallWorkload = teacher.workloadPercent.fall;

            if (springWorkload > maxWorkload)
                maxWorkload = springWorkload;

            if (fallWorkload > maxWorkload)
                maxWorkload = fallWorkload;

            let employment = teacher.employmentPercentage;

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
            insertAt(sortedTeachers, index, teacher);
            insertAt(teacherNames, index, teacherName);
            insertAt(springWorkloadColors, index, getWorkloadColor(springWorkload, employment));
            insertAt(springWorkloadBorderColors, index, getWorkloadBorderColor(springWorkload, employment));
            insertAt(springWorkloadDataValues, index, springWorkload);
            insertAt(fallWorkloadColors, index, getWorkloadColor(fallWorkload, employment));
            insertAt(fallWorkloadBorderColors, index, getWorkloadBorderColor(fallWorkload, employment));
            insertAt(fallWorkloadDataValues, index, fallWorkload);
        }

        function createChart(canvas, title, dataValues, dataColors, dataBorderColors) {

            let values = [];
            values.fill(0, 0, dataValues.length);

            let chart = new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: teacherNames,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: dataColors,
                            borderColor: dataBorderColors,
                            borderWidth: 1
                        }]
                },
                options: {
                    onClick: onSeasonChartClicked,
                    scales: {
                        xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + "%";
                                    },
                                    max: maxWorkload
                                }
                            }]
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: title
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var value = data.datasets[0].data[tooltipItem.index];
                                var label = data.labels[tooltipItem.index];

                                if (value === 0.1) {
                                    value = 0;
                                }

                                return label + ': ' + value + ' %';
                            }
                        }
                    }
                }
            });

            setTimeout(() => {
                chart.data.datasets[0].data = dataValues;
                chart.update();
            }, 500);
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
