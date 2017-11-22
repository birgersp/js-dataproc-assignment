/**
 * (Depends on Chart.js being pre-loaded)
 * Adds a Chart.js plugin to draw vertical lines in a chart
 */

"use strict";

if (!Chart)
    throw "Chart.js must be pre-loaded before loading this plugin";
else
    Chart.plugins.register({
        renderVerticalLine: function(chart, color, label, targetValue) {

            const lineLeftOffset = chart.scales["x-axis-0"].getPixelForValue(targetValue);
            const scale = chart.scales['y-axis-0'];
            const context = chart.chart.ctx;

            // render vertical line
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(lineLeftOffset, scale.top);
            context.lineTo(lineLeftOffset, scale.bottom);
            context.stroke();

            // write label
            context.fillStyle = color;
            context.textAlign = 'center';
            context.fillText(label, lineLeftOffset, scale.bottom);
        },

        afterDatasetsDraw: function(chart, easing) {

            if (chart.config.verticalLine)
                if (chart.config.verticalLine.enabled !== false) {
                    this.renderVerticalLine(chart, chart.config.verticalLine.color, chart.config.verticalLine.label, chart.config.verticalLine.targetValue);
                }

            if (chart.config.verticalLines) {
                for (let lineI in chart.config.verticalLines) {
                    let line = chart.config.verticalLines[lineI];

                    if (line.enabled !== false) {
                        this.renderVerticalLine(chart, line.color, line.label, line.targetValue);
                    }
                }
            }
        }
    });
