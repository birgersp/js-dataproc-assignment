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

    let sortedTeachers = [];
    let warningHeader = null;

    let options = {
        showStudAss: true,
        showExternal: true
    };

    let springChart = null;
    let fallChart = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    function onSpringChartClicked(event, array) {

        let activeTooltip = springChart.tooltip._active[0];
        if (activeTooltip) {
            console.log(activeTooltip);
        }
    }

    function onFallChartClicked(event, array) {

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

        for (let index in sortedTeachers) {

            let teacher = sortedTeachers[index];

            if (teacher.isExternal && !options.showExternal)
                continue;

            if (teacher.isStudentAssistant && !options.showStudAss)
                continue;

            let teacherName = teacher.lastName + ", " + teacher.firstName[0];

            let springWorkload = teacher.workloadPercent.spring;
            let fallWorkload = teacher.workloadPercent.fall;

            let employment = teacher.employmentPercentage;

            labels.push(teacherName);

            // Insert data (split by season)
            springWorkloadColors.push(getWorkloadColor(springWorkload, employment));
            springWorkloadBorderColors.push(getWorkloadBorderColor(springWorkload, employment));
            springWorkloadDataValues.push(springWorkload);

            fallWorkloadColors.push(getWorkloadColor(fallWorkload, employment));
            fallWorkloadBorderColors.push(getWorkloadBorderColor(fallWorkload, employment));
            fallWorkloadDataValues.push(fallWorkload);
        }

        function updateSingleDatasetChartHeight(chart) {

            let noOfLabels = chart.data.labels.length;
            let container = chart.canvas.parentNode;
            container.style.setProperty("height", (CHART_MISC_HEIGHT + (noOfLabels * CHART_HEIGHT_PER_LABEL)) + "px");
            chart.resize();
        }

        let springDataset = springChart.data.datasets[0];
        springDataset.data = springWorkloadDataValues;
        springDataset.backgroundColor = springWorkloadColors;
        springDataset.borderColor = springWorkloadBorderColors;
        springDataset.borderWidth = 1;
        springChart.data.labels = labels;
        updateSingleDatasetChartHeight(springChart);
        springChart.update();

        let fallDataset = fallChart.data.datasets[0];
        fallDataset.data = fallWorkloadDataValues;
        fallDataset.backgroundColor = fallWorkloadColors;
        fallDataset.borderColor = fallWorkloadBorderColors;
        fallDataset.borderWidth = 1;
        fallChart.data.labels = labels;
        updateSingleDatasetChartHeight(fallChart);
        fallChart.update();
    }

    this.initialize = function() {

        let dropdownContainer = createElement("div", self.container);
        setStyle(dropdownContainer, {
            "margin-left": "20px"
        });

        let dropdown = new TeacherManager.OptionsDropdown(dropdownContainer);
        dropdown.options = options;
        dropdown.onChange = update;

        dropdown.addOption("showStudAss", "Show stud.ass.");
        dropdown.addOption("showExternal", "Show external");

        warningHeader = createElement("h4", self.container, {innerHTML: "Loading workload data..."});
    };

    this.setTeacherData = function(teachers) {

        let maxWorkload = 0;

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];

            // Determine index according to first letter in name (sorting alphabetically)
            let teacherNameCharCode = teacher.lastName.charCodeAt(0);
            let found = false;
            let index = 0;
            while (!found) {
                if (index >= sortedTeachers.length) {
                    index = sortedTeachers.length;
                    found = true;
                } else {
                    if (sortedTeachers[index].lastName.charCodeAt(0) > teacherNameCharCode)
                        found = true;
                    else
                        index++;
                }
            }
            sortedTeachers.splice(index, 0, teacher);

            let springWorkload = teacher.workloadPercent.spring;
            let fallWorkload = teacher.workloadPercent.fall;

            if (springWorkload > maxWorkload)
                maxWorkload = springWorkload;

            if (fallWorkload > maxWorkload)
                maxWorkload = fallWorkload;
        }

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
                        intersect: false,
                        mode: 'y',
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

        springChart = createChart(springCanvas, "Workload, Spring", onSpringChartClicked, 1);
        fallChart = createChart(fallCanvas, "Workload, Fall", onFallChartClicked, 1);
        update();
    };
};
