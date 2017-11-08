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

    const CHART_MAX_WIDTH = 1600;
    const CHART_HEIGHT_PER_LABEL = 13;
    const CHART_MISC_HEIGHT = 100;

    let self = this;

    let teachers = [];
    let sortedTeachers = [];
    let warningHeader = null;

    let options = null;

    let combinedChart = null;
    let springChart = null;
    let fallChart = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    function onSeasonChartClicked(event, array) {

        // TODO: determine which teacher is clicked
    }

    function update() {

        let labels = [];
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
                if (index >= labels.length) {
                    index = labels.length;
                    found = true;
                } else {
                    if (labels[index].charCodeAt(0) > teacherNameCharCode)
                        found = true;
                    else
                        index++;
                }
            }

            // Insert data to chart datasets at index

            insertAt(sortedTeachers, index, teacher);
            insertAt(labels, index, teacherName);

            // Insert data (split by season)
            insertAt(springWorkloadColors, index, getWorkloadColor(springWorkload, employment));
            insertAt(springWorkloadBorderColors, index, getWorkloadBorderColor(springWorkload, employment));
            insertAt(springWorkloadDataValues, index, springWorkload);
            insertAt(fallWorkloadColors, index, getWorkloadColor(fallWorkload, employment));
            insertAt(fallWorkloadBorderColors, index, getWorkloadBorderColor(fallWorkload, employment));
            insertAt(fallWorkloadDataValues, index, fallWorkload);
        }

        function updateChartHeight(chart) {

            let noOfLabels = chart.data.labels.length;
            let container = chart.canvas.parentNode;
            container.style.setProperty("height", (CHART_MISC_HEIGHT + (noOfLabels * CHART_HEIGHT_PER_LABEL)) + "px");
        }

        let springDataset = springChart.data.datasets[0];
        springDataset.data = springWorkloadDataValues;
        springDataset.backgroundColor = springWorkloadColors;
        springDataset.borderColor = springWorkloadBorderColors;
        springDataset.borderWidth = 1;
        springChart.data.labels = labels;
        springChart.options.scales.xAxes[0].ticks.max = maxWorkload;
        updateChartHeight(springChart);
        springChart.update();

        let fallDataset = fallChart.data.datasets[0];
        fallDataset.data = fallWorkloadDataValues;
        fallDataset.backgroundColor = fallWorkloadColors;
        fallDataset.borderColor = fallWorkloadBorderColors;
        fallDataset.borderWidth = 1;
        fallChart.data.labels = labels;
        fallChart.options.scales.xAxes[0].ticks.max = maxWorkload;
        updateChartHeight(fallChart);
        fallChart.update();
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

    this.setTeacherData = function(newTeachers) {

        teachers = newTeachers;

        warningHeader.parentNode.removeChild(warningHeader);

        function createChartContainedCanvas() {

            let container = createElement("div", self.container);
            container.style.setProperty("max-width", CHART_MAX_WIDTH + "px");
            container.style.setProperty("margin", "0px");
            container.style.setProperty("padding", "0px");
            let canvas = createElement("canvas", container);
            return canvas;
        }

        let springCanvas = createChartContainedCanvas();
        let fallCanvas = createChartContainedCanvas();

        function createChart(canvas, title, onChartClicked, noOfDatasets) {

            let datasets = [];
            for (let i = 0; i < noOfDatasets; i++) {
                datasets.push({
                    data: [],
                    labels: [],
                    borderColor: [],
                    backgroundColor: []
                });
            }

            let chart = new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: [],
                    datasets: datasets
                },
                options: {
                    onClick: onChartClicked,
                    scales: {
                        xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + "%";
                                    },
                                    max: 100
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
                    },
                    maintainAspectRatio: false
                }
            });

            return chart;
        }

        let func = () => {
        };

        springChart = createChart(springCanvas, "Workload, Spring", func, 1);
        fallChart = createChart(fallCanvas, "Workload, Fall", func, 1);
        update();
    };
};
