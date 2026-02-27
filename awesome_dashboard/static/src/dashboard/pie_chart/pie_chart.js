import { Component, onWillStart, onMounted, onWillUpdateProps, useRef } from "@odoo/owl";
import { loadJS } from "@web/core/assets";

export class PieChart extends Component {
    static template = "awesome_dashboard.PieChart";
    static props = {
        data: Object,
    };

    setup() {
        this.canvasRef = useRef("canvas");
        this.chart = null;

        onWillStart(async () => {
            await loadJS("/web/static/lib/Chart/Chart.js");
        });

        onMounted(() => {
            this.renderChart();
        });

        onWillUpdateProps((nextProps) => {
            if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
                this.updateChart(nextProps.data);
            }
        });
    }

    renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }

        if (!this.canvasRef.el) {
            return;
        }

        const ctx = this.canvasRef.el.getContext("2d");
        
        const labels = Object.keys(this.props.data).map(size => size.toUpperCase());
        const data = Object.values(this.props.data);
        
        const colors = [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
        ];

        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'T-Shirts by Size',
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value} units`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateChart(newData) {
        if (!this.chart) {
            return;
        }

        // Update labels and data
        const labels = Object.keys(newData).map(size => size.toUpperCase());
        const data = Object.values(newData);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        
        // Animate the update
        this.chart.update();
    }

    willUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}