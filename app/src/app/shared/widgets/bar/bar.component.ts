import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  data_: [{ data: [], label: string }]; // Data + labels
  @Input() set data(value: [{ data: [], label: string }]) {
    if (!this.chartInitialized) { // Assign data and labels
      this.data_ = value;
      this.chartInitialized = true;
    } else {  // Assign only data - to smooth chart transitions
      for (let i = 0; i < this.data_.length; i++){
        this.data_[i].data = value[i].data;
      }
    }
  }
  @Input() labels = []; // Bottom of chart
  @Input() options = {};
  @Input() height: number;

  type = 'bar';
  legend = true;
  chartInitialized = false;

  constructor() { }

  ngOnInit(): void { }
}
