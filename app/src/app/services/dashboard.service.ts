import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PeriodicElement } from '../shared/widgets/table/table.component';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private cpuSettingsSubject = new Subject<any>();
  private cpuDataSubject = new Subject<any>();

  private ramDataSubject = new Subject<any>();
  private ramSettingsSubject = new Subject<any>();

  public intervalSubject = new BehaviorSubject<any>(true);

  constructor(private apiService: ApiService) { }

  bigChartData() {
    return [{
      name: 'Asia',
      data: [502, 635, 809, 947, 1402, 3634, 5268]
    }, {
      name: 'Africa',
      data: [106, 107, 111, 133, 221, 767, 1766]
    }, {
      name: 'Europe',
      data: [163, 203, 276, 408, 547, 729, 628]
    }, {
      name: 'America',
      data: [18, 31, 54, 156, 339, 818, 1201]
    }, {
      name: 'Oceania',
      data: [2, 2, 2, 6, 13, 30, 46]
    }];
  }

  pieChartData() {
    return [{
      name: 'Chrome',
      y: 61.41,
      sliced: true,
      selected: true
    }, {
      name: 'Internet Explorer',
      y: 11.84
    }, {
      name: 'Firefox',
      y: 10.85
    }, {
      name: 'Edge',
      y: 4.67
    }, {
      name: 'Safari',
      y: 4.18
    }, {
      name: 'Sogou Explorer',
      y: 1.64
    }, {
      name: 'Opera',
      y: 1.6
    }, {
      name: 'QQ',
      y: 1.2
    }, {
      name: 'Other',
      y: 2.61
    }];
  }

  tableData(): PeriodicElement[] {
    return [
      { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
      { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
      { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
      { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
      { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
      { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
      { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
      { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
      { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
      { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
      { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
      { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
      { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
      { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
      { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
      { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
      { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
      { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
      { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
      { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
    ];
  }

  cardsData() {
    return [71, 78, 39, 66];
  }

  barChartData() {
    return [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
  }

  initSystemSettings(): void {
    /* System usage - cpu usage, ram usage, cpu_count */
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
                min: 0
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

        /* RAM Options */
        const ramOptions = {
          scaleShowVerticalLines: false,
          responsive: true,
          scales : {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'RAM usage percentage'
              },
              ticks: {
                steps: 10,
                stepValue: 10,
                max: 100,
                min: 0
              }
            }]
          }
        };

        this.cpuSettingsSubject.next({ labels: cpuLabels, options: cpuOptions });
        this.ramSettingsSubject.next({ labels: [''], options: ramOptions });
        subscription.unsubscribe();
      }
    );
  }

  setSystemData(): void {
    /* System usage - cpu usage, ram usage, cpu_count */
    const subscription = this.apiService.systemUsage().subscribe(
      response => {
        /* Data [{ data: [], label: 'Title' }, ...] */
        const cpuData = [{
          data: response.cpu_usage,
          label: 'CPU usage',
          backgroundColor: '#f5b01b',
          hoverBackgroundColor: '#ff6200'
        }];
        const ramData = [{
          data: [ response.ram_usage.percent ],
          label: 'RAM usage',
          backgroundColor: '#1aacf0',
          hoverBackgroundColor: '#0388fc'
        }];

        this.cpuDataSubject.next(cpuData);
        this.ramDataSubject.next(ramData);
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

  getRamSettings(): Observable<any> {
    return this.ramSettingsSubject.asObservable();
  }

  getRamData(): Observable<any> {
    return this.ramDataSubject.asObservable();
  }
}
