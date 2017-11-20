"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");
include("../thirdparty/colorconverter.js"); /* global colorconv */

include("../utilities/vlineplugin.js");

include("OptionsDropdown.js");

function TMWorkloadBrowser() {

    const COLOR_ALPHA = 0.2;

    // Reduce overloaded teacher "redness" with this factor, higher value means higher overload will be ok (greener)
    const OVERLOAD_ERROR_REDUCTION = 1.0;

    const CHART_MAX_WIDTH = 1600;
    const CHART_HEIGHT_PER_LABEL = 40;
    const CHART_MISC_HEIGHT = 100;

    const SPRING_COLOR = "rgba(0,127,0,0.3)";
    const SPRING_BORDER_COLOR = "rgba(0,127,0,1)";

    const FALL_COLOR = "rgba(0,0,255,0.3)";
    const FALL_BORDER_COLOR = "rgba(0,0,255,1)";

    const MEAN_LINE_BODER_COLOR = "rgba(255,0,0,1)";
    const FULL_LINE_BODER_COLOR = "rgba(0,0,255,1)";

    let self = this;

    let activeTeachers = [];
    let sortedTeachers = [];
    let warningHeader = null;

    let options = {
        showStudAss: false,
        showExternal: false,
        showMean: true,
        normalize: false
    };

    let workloadChart = null;

    let meanWorkloadLine = {
        enabled: options.showMean,
        targetValue: 0,
        color: MEAN_LINE_BODER_COLOR,
        label: "Mean workload"
    };

    let fullWorkloadLine = {
        enabled: options.normalize,
        targetValue: 100,
        color: FULL_LINE_BODER_COLOR,
        label: ""
    };

    let verticalLines = [meanWorkloadLine, fullWorkloadLine];

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    let defaultTooltipCallback = (label, value) => {
        return label + ': ' + value + ' hours';
    };

    let normalizedTooltipCallback = (label, value) => {
        return label + ': ' + value + '%';
    };

    let defaultLabelCallback = (value) => {
        return value;
    };

    let normalizedLabelCallback = (value) => {
        return value + "%";
    };

    function onChartClicked(event, array) {

        let activeTooltip = workloadChart.tooltip._active[0];
        if (activeTooltip) {
            let teacher = activeTeachers[activeTooltip._index];
            self.onTeacherSelected(teacher);
        }
    }

    function update() {

        activeTeachers = [];

        workloadChart.data.datasets[0].data = [];
        workloadChart.data.datasets[1].data = [];
        workloadChart.data.labels = [];

        let summedWorkload = 0;
        let maxWorkload = 0;

        for (let index in sortedTeachers) {

            let teacher = sortedTeachers[index];
            activeTeachers.push(teacher);

            if (teacher.isExternal && !options.showExternal)
                continue;

            if (teacher.isStudentAssistant && !options.showStudAss)
                continue;

            let teacherName = teacher.lastName + ", " + teacher.firstName[0];
            workloadChart.data.labels.push(teacherName);

            let springWorkload, fallWorkload;
            if (options.normalize) {
                springWorkload = Math.round(teacher.workloadNormalized.spring * 100);
                fallWorkload = Math.round(teacher.workloadNormalized.fall * 100);
            } else
            {
                springWorkload = teacher.workload.spring;
                fallWorkload = teacher.workload.fall;
            }

            workloadChart.data.datasets[0].data.push(springWorkload);
            workloadChart.data.datasets[1].data.push(fallWorkload);

            summedWorkload += springWorkload;
            summedWorkload += fallWorkload;

            if (springWorkload > maxWorkload)
                maxWorkload = springWorkload;

            if (fallWorkload > maxWorkload)
                maxWorkload = fallWorkload;
        }

        let meanWorkload = summedWorkload / 2 / activeTeachers.length;
        meanWorkloadLine.targetValue = meanWorkload;

        function updateChartHeight(chart) {

            let noOfLabels = chart.data.labels.length;
            let container = chart.canvas.parentNode;
            container.style.setProperty("height", (CHART_MISC_HEIGHT + (noOfLabels * CHART_HEIGHT_PER_LABEL)) + "px");
            chart.resize();
        }

        workloadChart.options.scales.xAxes[0].ticks.max = maxWorkload;

        updateChartHeight(workloadChart);
        workloadChart.update();

        meanWorkloadLine.enabled = options.showMean;
        fullWorkloadLine.enabled = options.normalize;
    }

    this.initialize = function() {

        let dropdownContainer = createElement("div", self.container);
        setStyle(dropdownContainer, {
            "margin-left": "20px"
        });

        let dropdown = new TMOptionsDropdown(dropdownContainer);
        dropdown.options = options;
        dropdown.onChange = update;

        dropdown.addOption("showStudAss", "Show stud.ass.");
        dropdown.addOption("showExternal", "Show external");
        dropdown.addOption("showMean", "Show mean");
        dropdown.addOption("normalize", "Normalize");

        warningHeader = createElement("h4", self.container, {innerHTML: "Loading workload data..."});
    };

    this.setTeacherData = function(teachers) {

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

        let chartCanvas = createChartContainedCanvas();

        function createChart(canvas, title, onChartClicked) {

            let chart = new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    onClick: onChartClicked,
                    scales: {
                        xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    max: 0,
                                    callback: function(value, index, values) {
                                        if (options.normalize)
                                            return normalizedLabelCallback(value);
                                        else
                                            return defaultLabelCallback(value);
                                    }
                                }
                            }]
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

                                let label = data.labels[tooltipItem.index];

                                if (tooltipItem.datasetIndex == 0)
                                    label += " (spring)";
                                else
                                    label += " (fall)";

                                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                if (options.normalize)
                                    return normalizedTooltipCallback(label, value);
                                else
                                    return defaultTooltipCallback(label, value);
                            }
                        }
                    },
                    maintainAspectRatio: false
                },
                verticalLines: verticalLines
            });

            return chart;
        }

        workloadChart = createChart(chartCanvas, "Workload Hours", onChartClicked);
        workloadChart.data.datasets.push({
            data: [],
            backgroundColor: SPRING_COLOR,
            borderColor: SPRING_BORDER_COLOR,
            borderWidth: 1,
            label: "Spring"
        });
        workloadChart.data.datasets.push({
            data: [],
            backgroundColor: FALL_COLOR,
            borderColor: FALL_BORDER_COLOR,
            borderWidth: 1,
            label: "Fall"
        });
        update();
    };
}
