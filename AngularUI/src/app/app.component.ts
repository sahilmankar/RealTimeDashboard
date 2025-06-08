import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SignalRService } from './charts/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SignalRDashboards';

  constructor(private http: HttpClient, signalR: SignalRService) {
    const userGroup = Math.random() < 0.5 ? '1' : '2';
    signalR.startConnection(userGroup);
  }
  ngOnInit(): void {}

  downloadPDF(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((response: any) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);

      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;

      let filename = url.split('/').pop() || 'default';
      PDF_link.download = filename;
      PDF_link.click();
    });
  }

  downloadAndOpenPDF(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((response: any) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);

      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      //   TO OPEN PDF ON BROWSER IN NEW TAB
      window.open(pdfUrl, '_blank');

      let filename = url.split('/').pop() || 'default';
      PDF_link.download = filename;
      PDF_link.click();
    });
  }
}
