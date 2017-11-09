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
    const CHART_HEIGHT_PER_LABEL = 40;
    const CHART_MISC_HEIGHT = 100;

    const SPRING_COLOR = "rgba(0,255,0,0.3)";
    const SPRING_BORDER_COLOR = "rgba(0,255,0,1)";

    const FALL_COLOR = "rgba(0,0,255,0.3)";
    const FALL_BORDER_COLOR = "rgba(0,0,255,1)";

    let self = this;

    let activeTeachers = [];
    let sortedTeachers = [];
    let warningHeader = null;

    let options = {
        showStudAss: true,
        showExternal: true
    };

    let workloadChart = null;

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

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

        for (let index in sortedTeachers) {

            let teacher = sortedTeachers[index];
            activeTeachers.push(teacher);

            if (teacher.isExternal && !options.showExternal)
                continue;

            if (teacher.isStudentAssistant && !options.showStudAss)
                continue;

            let teacherName = teacher.lastName + ", " + teacher.firstName[0];
            workloadChart.data.labels.push(teacherName);

            workloadChart.data.datasets[0].data.push(teacher.workload.spring);
            workloadChart.data.datasets[1].data.push(teacher.workload.fall);
        }

        function updateChartHeight(chart) {

            let noOfLabels = chart.data.labels.length;
            let container = chart.canvas.parentNode;
            container.style.setProperty("height", (CHART_MISC_HEIGHT + (noOfLabels * CHART_HEIGHT_PER_LABEL)) + "px");
            chart.resize();
        }

        updateChartHeight(workloadChart);
        workloadChart.update();
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

            let springWorkload = teacher.workload.spring;
            if (springWorkload > maxWorkload)
                maxWorkload = springWorkload;

            let fallWorkload = teacher.workload.fall;
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
                                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                var label = data.labels[tooltipItem.index];
                                return label + ': ' + value + ' hours';
                            }
                        }
                    },
                    maintainAspectRatio: false
                }
            });

            return chart;
        }

        workloadChart = createChart(chartCanvas, "Workload Hours", onChartClicked);
        workloadChart.data.datasets.push({
            data: [],
            backgroundColor: SPRING_COLOR,
            borderColor: SPRING_BORDER_COLOR,
            borderWidth: 1
        });
        workloadChart.data.datasets.push({
            data: [],
            backgroundColor: FALL_COLOR,
            borderColor: FALL_BORDER_COLOR,
            borderWidth: 1
        });
        update();
    };
};
