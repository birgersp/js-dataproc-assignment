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

    function onChartClick(event, array) {

        // TODO: appropriately handle clicks
        // to handle clicks on labels, see: https://stackoverflow.com/questions/39001705/chart-js-click-on-labels-using-bar-chart
    }

    this.initialize = function() {

        self.container.innerHTML = "<input type=\"checkbox\"></input>";

        let canvasContainer = createElement("div", self.container);
        canvasContainer.style.setProperty("width", "1000px");

        let canvas = createElement("canvas", canvasContainer);
        let style = canvas.style;

        chart = new Chart(canvas, {
            type: 'bar',
            data: {
                // Name of each teacher
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: 'Spring',

                        // Workload of each teacher during the spring
                        data: [19, 3],
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Fall',

                        // Workload of each teacher during the fall
                        data: [12, 5],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
            },
            options: {
                onClick: onChartClick,
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
    };

    this.update = function() {

        console.log(self.teachers);

        // TODO: generate chart(s)
    };
};
