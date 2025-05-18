// Create a single connection globally
const connection = new signalR.HubConnectionBuilder()
    .withUrl(`/chartHub?groupId=1`) // Pass groupId once here
    .build();

const charts = {};

function connectChart(chartType, chartId) {
    const ctx = document.getElementById(chartId).getContext("2d");
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: chartType,
                data: [],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
            }]
        }
    });
    charts[chartType] = chart;
}

// Handle incoming data for any chart type dynamically
connection.on("ReceiveChartData", (chartType, data) => {
    const chart = charts[chartType];
    if (!chart) return; // Ignore if chart not connected

    const label = new Date(data.time || data.Time).toLocaleTimeString();
    const value = data.price || data.volume || data.sentiment;

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(value);

    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
});

// Start connection once
connection.start()
    .then(() => {
        connectChart("Stock", "stockChart");
        connectChart("Volume", "volumeChart");
        connectChart("Sentiment", "sentimentChart");
    })
    .catch(err => console.error(err));
