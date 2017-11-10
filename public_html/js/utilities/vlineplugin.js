/**
 * (Depends on Chart.js being pre-loaded)
 */

const verticalLinePlugin = {
    getLinePosition: function(chart) {
        return chart.scales["x-axis-0"].getPixelForValue(chart.config.verticalLine.targetValue);
    },
    renderVerticalLine: function(chart, color) {

        const lineLeftOffset = this.getLinePosition(chart);
        const scale = chart.scales['y-axis-0'];
        const context = chart.chart.ctx;

        // render vertical line
        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();
    },

    afterDatasetsDraw: function(chart, easing) {

        if (!chart.config.verticalLine)
            return;

        this.renderVerticalLine(chart, chart.config.verticalLine.color);
    }
};

Chart.plugins.register(verticalLinePlugin);

