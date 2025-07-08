import {
  Component,
  ViewChild,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { getRandomChartColors } from 'app/charts/ChartColors';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SignalRService } from '../signalr.service';
import { ApiRow } from './ApiRow';
import { buildDrilldownTree, DrilldownNode } from './DrilldownNode';
import { downloadChartAsPNG } from '../ChartHelper';

@Component({
  selector: 'app-dynamic-drilldown-chart',
  templateUrl: './dynamic-drilldown-chart.component.html',
  styleUrl: './dynamic-drilldown-chart.component.scss',
})
export class DynamicDrilldownChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  rawData: ApiRow[] = [];
  groupingKeys = ['year', 'quarter', 'region', 'productName'];

  rootNode: DrilldownNode | null = null;
  currentNode?: DrilldownNode;
  breadcrumb: string[] = [];
  drillPath: DrilldownNode[] = [];

  labels: string[] = [];
  data: ChartDataset<'bar'>[] = [];
  isLiveUpdateEnabled = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private signalR: SignalRService
  ) {}

  options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 20,
        left: 15,
        right: 15,
      },
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
      display: false, 
    },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderWidth: 1,
        borderColor: '#888',
        cornerRadius: 6,
        callbacks: {
          label: (context) => `Amount: $${context.parsed.y.toLocaleString()}`,
        },
      },
      title: {
        display: true,
        text: 'Multi level Sales Breakdown',
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
    scales: {
      x: {
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: '#4B5563',
        },
        grid: {
          color: '#E5E7EB',
          // drawBorder: false
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          font: {
            size: 13,
          },
          color: '#4B5563',
        },
        grid: {
          color: '#E5E7EB',
          // drawBorder: false
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: true,
    },
    onHover: (event, elements) => {
      (event.native?.target as HTMLElement).style.cursor = elements.length
        ? 'pointer'
        : 'default';
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        this.handleDrilldown(idx);
      }
    },
  };

  ngOnInit() {
    this.signalR.on<any[]>('ReceiveSalesChartData', (data) => {
      if(!this.isLiveUpdateEnabled)return;
      this.rawData = data;
      console.log('🚀 ~ ngOnInit ~ data:', data);
      if (!this.rawData.length || !this.groupingKeys.length) return;
      const tree = buildDrilldownTree(this.rawData, this.groupingKeys);
      if (tree ) {
        this.rootNode = tree;
        this.drillPath = [];
        this.breadcrumb = [];
        this.setCurrentNode(tree);
      }
    });

    this.signalR.subscribeToChart('SalesChart');
  }
   toggleLiveUpdates() {
    this.isLiveUpdateEnabled = !this.isLiveUpdateEnabled;

    if (this.isLiveUpdateEnabled) {
      this.signalR.subscribeToChart('SalesChart');
    }
  }
  downloadChartAsImage() {
    downloadChartAsPNG(this.chart, 'Multi-level Sales');
  }

  setCurrentNode(node: DrilldownNode) {
    this.currentNode = node;
    this.labels = [...node.labels];
    const colors = getRandomChartColors(node.data.length);

    this.data = [
      {
        data: [...node.data],
        label: node.label,
        backgroundColor: colors.map((c) => c.backgroundColor),
        borderColor: colors.map((c) => c.borderColor),

        borderRadius: 6,
        maxBarThickness: 50,
        borderWidth: 1,
      },
    ];
    this.chart?.update();
    this.cdr.detectChanges();
  }

  handleDrilldown(index: number) {
    if (!this.currentNode || !this.currentNode.children) return;
    const nextNode = this.currentNode.children[index];

    if (nextNode) {
      this.drillPath.push(nextNode);
      this.breadcrumb.push(nextNode.label);
      this.setCurrentNode(nextNode);
    }
  }

  resetDrill() {
    if (!this.rootNode) return;
    this.breadcrumb = [];
    this.drillPath = [];
    this.setCurrentNode(this.rootNode);
  }

  goToLevel(index: number) {
    if (index < 0 || index >= this.drillPath.length) return;

    const pathToLevel = this.drillPath.slice(0, index + 1);
    this.drillPath = pathToLevel;
    this.breadcrumb = this.breadcrumb.slice(0, index + 1);
    const targetNode = pathToLevel[index];
    this.setCurrentNode(targetNode);
  }
}
