import { Component, ViewChild } from '@angular/core';
import { SignalRService } from '../signalr.service';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { getRandomChartColors } from 'app/charts/ChartColors';
import { downloadChartAsPNG } from '../ChartHelper';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {
@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private signalR: SignalRService) {}
  isLiveUpdateEnabled = true;

  ngOnInit(): void {
    this.signalR.on<any[]>('ReceiveBarChartData', this.handleIncomingData);
    this.signalR.subscribeToChart('Bar');
  }

  downloadChartAsImage() {
    downloadChartAsPNG(this.chart, 'line');
  }

  toggleLiveUpdates() {
    this.isLiveUpdateEnabled = !this.isLiveUpdateEnabled;

    if (this.isLiveUpdateEnabled) {
      this.signalR.subscribeToChart('Bar');
    }
  }

  private handleIncomingData = (data: any[]) => {
    if (!this.isLiveUpdateEnabled) return;
    this.labels = data.map((d) => new Date(d.time).toLocaleTimeString());
    const colors = getRandomChartColors(data.length);

    this.data = [
      {
        data: data.map((d) => d.price),
        label: 'Price',
        backgroundColor: colors.map((c) => c.backgroundColor),
        borderColor: colors.map((c) => c.borderColor),
        borderWidth: 1,
     
      },
    ];

    this.chart?.update();
  };

  labels: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  data: ChartDataset<'line'>[] = [
    {
      data: [5000, 15000, 10000, 20000],
      label: 'Sales',
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)', // blue bars with some transparency
        'rgba(75, 192, 192, 0.7)', // teal
        'rgba(255, 206, 86, 0.7)', // yellow
        'rgba(153, 102, 255, 0.7)', // purple
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
         },
  ];

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart', // smooth easing on load
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
        position: 'top',
      },
      datalabels: {
      display: false, 
    },
      title: {
        display: true,
        text: 'Price Changes/Minute',
        font: {
          size: 14,
          weight: 'bold',
          family: 'Segoe UI',
        },
        // padding: {
        //   top: 10,
        //   bottom: 20,
        // },
        color: '#374151',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 4,
        padding: 8,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: { size: 12, weight: 'bold' },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
          tickBorderDash: [5, 5],
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          // stepSize: 50,
        },
      },
    },
  };

}
