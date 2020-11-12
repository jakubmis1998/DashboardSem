import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import * as Tiff from 'tiff.js';
import * as FileSaver from 'file-saver';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  tiffImage: any;  // Image as Tiff
  tiffInfo: {};  // Tiff info
  canvasContainer: HTMLElement;  // For styling and replace tiffs
  loading = false;
  tiffFileObject: File;  // Tiff as File
  withDownload = false;

  chartData: [{ data: [], label: string }];
  chartSettings: { labels: [], options: {} };
  dataSubscription: Subscription;
  settingsSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private dashboardService: DashboardService) {
    Tiff.initialize({ TOTAL_MEMORY: 4777216 * 10 });  // Initialize the memory with 47 MB
  
    this.dashboardService.initCpuSettings();
    this.settingsSubscription = this.dashboardService.getCpuSettings().subscribe(settings => {
      this.chartSettings = settings;
    });

    this.dataSubscription = this.dashboardService.getCpuDataCpu().subscribe(data => {
      this.chartData = data;
    });
  }

  ngOnInit(): void {
    this.canvasContainer = document.querySelector('.canvas-container');
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
  }

  readFile(input: any): void {
    this.loading = true;

    this.tiffFileObject = input.target.files[0];
    let fileReader = new FileReader();

    /* Convert File to ArrayBuffer and display TIFF */
    fileReader.readAsArrayBuffer(this.tiffFileObject); // convert selected file
    fileReader.onload = (event) => { // file is now ArrayBuffer:
      this.tiffImage = new Tiff({ buffer: event.target.result }); // parse and convert
      this.setTiffInfo();
      this.replaceTiff();
    };
  }

  setTiffInfo(): void {
    this.tiffInfo = {};
    this.tiffInfo['name'] = this.tiffFileObject.name;
    this.tiffInfo['width'] = this.tiffImage.width();
    this.tiffInfo['height'] = this.tiffImage.height();
    this.tiffInfo['pages'] = this.tiffImage.countDirectory();
    this.tiffInfo['current_page'] = this.tiffImage.currentDirectory();
  }

  goLeft() {
    let currentPage = this.tiffInfo['current_page'];
    this.tiffImage.setDirectory(currentPage - 1);
    this.tiffInfo['current_page'] -= 1;
    this.replaceTiff();
  }

  goRight() {
    let currentPage = this.tiffInfo['current_page'];
    this.tiffImage.setDirectory(currentPage + 1);
    this.tiffInfo['current_page'] += 1;
    this.replaceTiff();
  }

  replaceTiff() {
    let newCanvas = this.tiffImage.toCanvas();
    newCanvas.classList.add('w-50');
    if (this.canvasContainer.querySelector('canvas')) {
      this.canvasContainer.replaceChild(newCanvas, this.canvasContainer.querySelector('canvas'));
    } else {
      this.canvasContainer.appendChild(newCanvas);
    }
    this.loading = false;
  }

  onNewParameters(parameters: FormArray) {
    if (this.withDownload) {
      this.apiService.sendParametrizedImage(this.tiffFileObject, parameters, true).subscribe(
        response => {
          let blob = new Blob([response], { type: 'image/tiff' });
          FileSaver.saveAs(blob, 'somefilename.tif');
        },
        error => console.log(error)
      );
    } else {
      this.apiService.sendParametrizedImage(this.tiffFileObject, parameters, false).subscribe(
        response => {
          console.log(response);
        },
        error => console.log(error)
      );
    }
  }

}
