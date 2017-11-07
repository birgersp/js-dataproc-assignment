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

    let sortedTeachers = [];

    this.container = null;
    this.onTeacherSelected = function(teacher) {};

    function onSeasonChartClicked(event, array) {
        if (array[0]) {
            let teacher = sortedTeachers[array[0]._index];
            self.onTeacherSelected(teacher);
        }
    }

    function createDropdown() {

        let someContainer = createElement("div", self.container, {"class": "dropdown"});

        let buttonDiv = createElement("div", someContainer, {
            "class": "button-group"
        });

        let button = createElement("button", buttonDiv, {
            type: "button",
            "class": "btn btn-default btn-sm dropdown-toggle",
            "data-toggle": "dropdown"
        });

        createElement("span", button, {
            "class": "glyphicon glyphicon-cog",
            innerHTML: " "
        });

        button.innerHTML += " ";

        createElement("span", button, {
            "class": "caret"
        });

        let dropdownList = createElement("ul", buttonDiv, {
            "class": "dropdown-menu"
        });

        let li1 = createElement("li", dropdownList);
        let a1 = createElement("a", li1, {
            href: "#",
            "class": "small"
        });

        let checkbox1 = createElement("input", a1, {
            type: "checkbox",
            id: "checkbox"
        });

        let check = () => {
            let element = document.getElementById("checkbox");
            element.checked = !element.checked;
        };

        a1.onclick = function(e) {
            check();
            e.stopPropagation();
        };

        a1.innerHTML += " Option 1";
    }

    this.initialize = function() {
        // TODO: maybe show some warning here, "awating data"
    };

    this.setTeacherData = function(teachers) {

        self.container.innerHTML = "";

        createDropdown();

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
            insertAt(sortedTeachers, index, teacher);
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
                    onClick: onSeasonChartClicked,
                    scales: {
                        xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + "%" + (value == MAX_WORKLOAD_THRESHOLD ? "+" : "");
                                    },
                                    max: MAX_WORKLOAD_THRESHOLD
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
