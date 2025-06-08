import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private group: string = '';
  private isConnected = false;

  connectionState$ = new BehaviorSubject<boolean>(false);

    startConnection(userGroup: string): void {
    this.group = userGroup;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5294/chartHub?groupId=${userGroup}`)
      .withAutomaticReconnect() // retry on failure
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        this.connectionState$.next(true);
        console.log('SignalR connected');
      })
      .catch((err) => {
        this.isConnected = false;
        this.connectionState$.next(false);
        console.error('SignalR connection error:', err);
      });

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected');
      this.connectionState$.next(true);
    });

    this.hubConnection.onclose(() => {
      this.isConnected = false;
      this.connectionState$.next(false);
      console.warn('SignalR disconnected');
    });
  }

  on<T>(event: string, handler: (data: T) => void): void {
    this.hubConnection.on(event, handler);
  }
    
  off(event: string): void {
      this.hubConnection.off(event);
      console.log(`🛑 Unsubscribed from ${event}`);
    }
  

  invoke<T = any>(method: string, ...args: any[]): Promise<T> {
    return this.hubConnection.invoke<T>(method, ...args);
  }

  subscribeToChart(chartType: 'Bar' | 'Pie' | 'SalesChart'): void {
    if (!this.isConnected) {
      console.warn('SignalR not connected yet. Delaying subscription...');
      this.connectionState$.subscribe((connected) => {
        if (connected) {
          this.invoke('RequestChartData', chartType, this.group).catch((err) =>
            console.error(`Failed to request ${chartType} chart data:`, err)
          );
        }
      });
    } else {
      this.invoke('RequestChartData', chartType, this.group).catch((err) =>
        console.error(`Failed to request ${chartType} chart data:`, err)
      );
    }
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }
}
