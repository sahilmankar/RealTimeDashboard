import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BaseChartDirective } from 'ng2-charts';
import { DynamicDrilldownChartComponent } from './dynamic-drilldown-chart/dynamic-drilldown-chart.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartToolBarComponent } from './chart-tool-bar/chart-tool-bar.component';
import { LineChartComponent } from './line-chart/line-chart.component';
@NgModule({
  declarations: [
    BarChartComponent,
    PieChartComponent,
    DynamicDrilldownChartComponent,
    MainDashboardComponent,
    ChartToolBarComponent,
    LineChartComponent,
  ],
  imports: [CommonModule, BaseChartDirective, GridsterModule, DragDropModule,],
  exports: [
    BarChartComponent,
    PieChartComponent,
    LineChartComponent,
  
    DynamicDrilldownChartComponent,
    MainDashboardComponent
  ],
})
export class ChartsModule {}
