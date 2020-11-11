import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  @Input() data = [];
  barChartOptions = {};
  barChartLabels = [];
  barChartType: string;
  barChartLegend: boolean;
  barChartData = [];

  constructor() { }

  ngOnInit(): void {

    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartData = this.data;

    // Losowanie wartosci wykresu co 2 s z przedzialu 0 - 100
    setInterval(() => {
      let liczba = this.getRandomInt(0, 100);
      this.barChartData[0].data = [liczba, liczba, liczba, liczba, liczba, liczba, liczba];
    }, 2000)
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
