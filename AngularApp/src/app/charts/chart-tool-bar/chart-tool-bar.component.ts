import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-tool-bar',
  templateUrl: './chart-tool-bar.component.html',
  styleUrl: './chart-tool-bar.component.scss',
})
export class ChartToolBarComponent {
  @Input() isLiveUpdateEnabled = false;

  @Output() liveUpdateToggle = new EventEmitter<void>();
  @Output() downloadChart = new EventEmitter<void>();

  toggleLiveUpdates() {
    this.liveUpdateToggle.emit();
  }

  downloadChartAsImage() {
    this.downloadChart.emit();
  }
}
