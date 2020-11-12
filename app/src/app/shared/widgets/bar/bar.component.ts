import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  _data: [{ data: [], label: string }]; // Data + labels
  @Input() set data(value: [{ data: [], label: string }]) {
    if (!this.chartInitialized) { // Assign data and labels
      this._data = value;
      this.chartInitialized = true;
    } else {  // Assign only data - to smooth chart transitions
      for (let i=0; i<this._data.length; i++){
        this._data[i].data = value[i].data;
      }
    }
  };
  @Input() labels = []; // Bottom of chart
  @Input() options = {};
  type: string = 'bar';
  legend: boolean = true;
  chartInitialized = false;

  constructor() { }

  ngOnInit(): void { }
}
