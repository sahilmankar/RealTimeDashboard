import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent {
  charts = [
    { id: 1, type: 'bar', span: 1 },
    { id: 2, type: 'pie', span: 1 },
    { id: 3, type: 'bar', span: 1 },
    { id: 4, type: 'pie', span: 1 },
    { id: 5, type: 'bar', span: 1 },
    { id: 6, type: 'pie', span: 1 },
    { id: 7, type: 'bar', span: 1 },
    { id: 8, type: 'pie', span: 1 },
  ];

  drop(event: CdkDragDrop<any[]>) {
    console.log("🚀 ~ drop ~ event:", event);
    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);
  }
}
