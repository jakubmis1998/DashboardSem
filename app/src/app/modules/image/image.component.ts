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
  isTogglerChecked = true;

  cpuChartData: [{ data: number[], label: string }];
  cpuChartSettings: { labels: string[], options: {} };
  cpuDataSubscription: Subscription;
  cpuSettingsSubscription: Subscription;

  ramChartData: [{ data: number[], label: string }];
  ramChartSettings: { labels: string[], options: {} };
  ramDataSubscription: Subscription;
  ramSettingsSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private dashboardService: DashboardService) {
    Tiff.initialize({ TOTAL_MEMORY: 4777216 * 10 });  // Initialize the memory with 47 MB

    this.dashboardService.initSystemSettings();

    /* CPU CHART */
    this.cpuSettingsSubscription = this.dashboardService.getCpuSettings().subscribe(settings => {
      this.cpuChartSettings = settings;
    });
    this.cpuDataSubscription = this.dashboardService.getCpuData().subscribe(data => {
      this.cpuChartData = data;
    });

    /* RAM CHART */
    this.ramSettingsSubscription = this.dashboardService.getRamSettings().subscribe(settings => {
      this.ramChartSettings = settings;
    });
    this.ramDataSubscription = this.dashboardService.getRamData().subscribe(data => {
      this.ramChartData = data;
    });

  }

  ngOnInit(): void {
    this.isTogglerChecked = this.dashboardService.intervalSubject.getValue();
    this.canvasContainer = document.querySelector('.canvas-container');
  }

  ngOnDestroy(): void {
    this.cpuDataSubscription.unsubscribe();
    this.cpuSettingsSubscription.unsubscribe();
    this.ramDataSubscription.unsubscribe();
  }

  readFile(input: any): void {
    this.loading = true;

    this.tiffFileObject = input.target.files[0];
    const fileReader = new FileReader();

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

  goLeft(): void {
    const currentPage = this.tiffInfo['current_page'];
    this.tiffImage.setDirectory(currentPage - 1);
    this.tiffInfo['current_page'] -= 1;
    this.replaceTiff();
  }

  goRight(): void {
    const currentPage = this.tiffInfo['current_page'];
    this.tiffImage.setDirectory(currentPage + 1);
    this.tiffInfo['current_page'] += 1;
    this.replaceTiff();
  }

  replaceTiff(): void {
    const newCanvas = this.tiffImage.toCanvas();
    newCanvas.classList.add('w-50');
    if (this.canvasContainer.querySelector('canvas')) {
      this.canvasContainer.replaceChild(newCanvas, this.canvasContainer.querySelector('canvas'));
    } else {
      this.canvasContainer.appendChild(newCanvas);
    }
    this.loading = false;
  }

  onNewParameters(parameters: FormArray): void {
    if (this.withDownload) {
      this.apiService.sendParametrizedImage(this.tiffFileObject, parameters, true).subscribe(
        response => {
          const blob = new Blob([response], { type: 'image/tiff' });
          FileSaver.saveAs(blob, `${this.tiffFileObject.name.split(".")[0]}_R${parameters['switches'][0]['R']}.tif`);
        },
        error => console.log(error)
      );
    } else {
      parameters['filename'] = this.tiffFileObject.name;
      parameters['pages'] = this.tiffInfo['pages'];
      parameters['X'] = this.tiffInfo['width'];
      parameters['Y'] = this.tiffInfo['height'];

      const formData = new FormData();
      formData.append('image', this.tiffFileObject);
      formData.append('processing_info', JSON.stringify(parameters));

      if (parameters['method'] === 'kernel') {
        console.log(parameters);
        this.apiService.processingWithKernel(formData).subscribe(
          response => {
            console.log(response);
            const blob = new Blob([response], { type: 'image/tiff' });
            FileSaver.saveAs(
              blob,
              `${this.tiffFileObject.name.split(".")[0]}_R${parameters['switches'][0]['R']}_T${parameters['switches'][0]['T']}_${parameters['method']}.tif`
            );
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  onSlideToggle(): void {
    this.dashboardService.intervalSubject.next(this.isTogglerChecked);
  }

}
