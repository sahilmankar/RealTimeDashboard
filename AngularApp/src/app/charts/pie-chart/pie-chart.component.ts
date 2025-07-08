import { Component, ViewChild } from '@angular/core';
import { SignalRService } from '../signalr.service';
import { ChartOptions, ChartType, ChartDataset, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { downloadChartAsPNG } from '../ChartHelper';
import { getRandomChartColors } from '../ChartColors';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  labels: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  data: ChartDataset<'pie'>[] = [
    { data: [5000, 15000, 10000, 20000], label: 'Sales' },
  ];
  isLiveUpdateEnabled = true;

  options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 8,
            weight: 'bold',
          },
        },
        position: 'bottom',
      },

      title: {
        display: false,
        text: 'Catgory Breakdown',
        font: {
          size: 14,
          weight: 'bold',
          family: 'Segoe UI',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: '#374151',
      },
    },
  };
  constructor(private signalR: SignalRService) {}

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  ngOnInit(): void {
    this.signalR.on<any[]>('ReceivePieChartData', (data) => {
      this.labels = data.map((d) => d.label);
      const colors = getRandomChartColors(data.length);

      this.data = [
        {
          data: data.map((d) => d.value),
          label: 'Price',

          backgroundColor: colors.map((c) => c.borderColor),
          borderColor: colors.map((c) => c.borderColor),
          borderWidth: 3,
          // borderRadius: 6,
        },
      ];
    });

    this.signalR.subscribeToChart('Pie');
  }
  downloadChartAsImage() {
    downloadChartAsPNG(this.chart, 'Pie');
  }

  toggleLiveUpdates() {
    this.isLiveUpdateEnabled = !this.isLiveUpdateEnabled;

    if (this.isLiveUpdateEnabled) {
      this.signalR.subscribeToChart('Pie');
    }
  }
}
