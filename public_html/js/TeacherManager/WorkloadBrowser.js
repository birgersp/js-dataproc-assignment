"use strict";

include("../utilities/utilities.js");
include("../thirdparty/Chart.min.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.WorkloadBrowser = function() {

    let self = this;

    this.container = null;
    this.teachers = null;

    let chart = null;

    let teacherNames = [];
    let springWorkloadDataValues = [];
    let fallWorkloadDataValues = [];

    function onChartClick(event, array) {

        // TODO: appropriately handle clicks
        // to handle clicks on labels, see: https://stackoverflow.com/questions/39001705/chart-js-click-on-labels-using-bar-chart
    }

    this.initialize = function() {

        self.container.innerHTML = "";

        let canvasContainer = createElement("div", self.container);
//        canvasContainer.style.setProperty("width", "1000px");

        let canvas = createElement("canvas", canvasContainer);

        chart = new Chart(canvas, {
            type: 'horizontalBar',
            data: {
                labels: teacherNames,
                datasets: [
                    {
                        label: 'Spring',
                        data: springWorkloadDataValues,
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Fall',
                        data: fallWorkloadDataValues,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
            },
            options: {
                onClick: onChartClick,
                scales: {
                    xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
    };

    this.update = function() {

        let springDataValues = chart.data.datasets[0].data;
        let fallDataValues = chart.data.datasets[1].data;

        for (let teacherID in self.teachers) {

            let teacher = self.teachers[teacherID];

            teacherNames.push(teacher.lastName + ", " + teacher.firstName);
            springDataValues.push(teacher.workloadPercent.spring);
            fallDataValues.push(teacher.workloadPercent.fall);

            chart.update();

//            chart.data.datasets[0].data.push()
        }

        // TODO: generate chart(s)

        // Name of each teacher
//        newData =
//                {
//                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//                    datasets: [
//                        {
//                            label: 'Spring',
//
//                            // Workload of each teacher during the spring
//                            data: [19, 3],
//                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
//                            borderColor: 'rgba(255, 206, 86, 1)',
//                            borderWidth: 1
//                        },
//                        {
//                            label: 'Fall',
//
//                            // Workload of each teacher during the fall
//                            data: [12, 5],
//                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                            borderColor: 'rgba(54, 162, 235, 1)',
//                            borderWidth: 1
//                        }]
//                };
    };
};
