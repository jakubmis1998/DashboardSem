import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private cpuSettingsSubject = new Subject<any>();
  private cpuDataSubject = new Subject<any>();

  private ramGpuDataSubject = new Subject<any>();
  private ramGpuSettingsSubject = new Subject<any>();

  public intervalSubject = new BehaviorSubject<any>(true);

  constructor(private apiService: ApiService) { }

  initSystemSettings(): void {
    /* System usage - cpu usage, ram/gpu usage, cpu_count */
    const subscription = this.apiService.systemUsage().subscribe(
      response => {
        /* Labels - [ '#1', '#2', ..., '#cpu_count' ] */
        let cpuLabels: any = Array.from(Array(response['cpu_count']).keys());
        cpuLabels = cpuLabels.map(label => (label + 1).toString());

        /* CPU Options */
        const cpuOptions = {
          scaleShowVerticalLines: false,
          responsive: true,
          scales : {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'CPU usage percentage'
              },
              ticks: {
                steps: 10,
                stepValue: 10,
                max: 100,
                min: 0,
                callback: function(tick) {
                  return tick.toString() + '%';
                }
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Processor number'
              }
            }]
          }
        };

        /* RAM and GPU Options */
        const ramGpuOptions = {
          scaleShowVerticalLines: false,
          responsive: true,
          scales : {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'RAM/GPU usage percentage'
              },
              ticks: {
                steps: 10,
                stepValue: 10,
                max: 100,
                min: 0,
                callback: function(tick) {
                  return tick.toString() + '%';
                }
              }
            }]
          }
        };

        this.cpuSettingsSubject.next({ labels: cpuLabels, options: cpuOptions });
        this.ramGpuSettingsSubject.next({ labels: [''], options: ramGpuOptions });
        subscription.unsubscribe();
      }
    );
  }

  setSystemData(): void {
    /* System usage - cpu usage, ram/gpu usage, cpu_count */
    const subscription = this.apiService.systemUsage().subscribe(
      response => {
        /* Data [{ data: [], label: 'Title' }, ...] */
        const cpuData = [{
          data: response.cpu_usage,
          label: response.cpu_name,
          backgroundColor: '#f5b01b',
          hoverBackgroundColor: '#ff6200'
        }];
        const ramGpuData = [
          {
            data: [ response.ram_usage.percent ],
            label: 'RAM memory usage',
            backgroundColor: '#1aacf0',
            hoverBackgroundColor: '#0388fc'
          },
          {
            data: [ response.gpu_usage ],
            label: response.gpu_name || 'No GPU',
            backgroundColor: '#d22054',
            hoverBackgroundColor: '#f50048'
          }
        ];

        this.cpuDataSubject.next(cpuData);
        this.ramGpuDataSubject.next(ramGpuData);
        subscription.unsubscribe();
      }
    );
  }

  getCpuSettings(): Observable<any> {
    return this.cpuSettingsSubject.asObservable();
  }

  getCpuData(): Observable<any> {
    return this.cpuDataSubject.asObservable();
  }

  getRamGpuSettings(): Observable<any> {
    return this.ramGpuSettingsSubject.asObservable();
  }

  getRamGpuData(): Observable<any> {
    return this.ramGpuDataSubject.asObservable();
  }
}
