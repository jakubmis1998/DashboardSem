import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import * as Tiff from 'tiff.js';
import * as FileSaver from 'file-saver';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  tiffImage: Tiff;  // Image as Tiff
  tiffInfo: {
    name: string,
    width: number,
    height: number,
    pages: number,
    currentPage: number
  }; // Tiff info
  canvasContainer: HTMLElement;  // For styling and replace tiffs
  loading = false;
  tiffFileObject: File;  // Tiff as File
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
    private dashboardService: DashboardService,
    private toastr: ToastrService) {
    Tiff.initialize({ TOTAL_MEMORY: 10077216 * 10 });  // Initialize the memory with 100 MB

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
    this.tiffInfo = {
      name: this.tiffFileObject.name,
      width: this.tiffImage.width(),
      height: this.tiffImage.height(),
      pages: this.tiffImage.countDirectory(),
      currentPage: this.tiffImage.currentDirectory()
    };
  }

  goLeft(): void {
    const currentPage = this.tiffInfo.currentPage;
    this.tiffImage.setDirectory(currentPage - 1);
    this.tiffInfo.currentPage -= 1;
    this.replaceTiff();
  }

  goRight(): void {
    const currentPage = this.tiffInfo.currentPage;
    this.tiffImage.setDirectory(currentPage + 1);
    this.tiffInfo.currentPage += 1;
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

  cartesianProductOf(...sets) {
    const flatten = (arr) => [].concat.apply([], arr);
    return sets.reduce(
      (acc, set) => flatten(acc.map(x => set.map(y => [ ...x, y ]))), [[]]);
  }

  onNewParameters(parameters: FormArray): void {
    if (parameters['method'] === 'kernel') {

      let Rs = [], Ts = [];
      for (const el of parameters['switches']) {
        Rs.push(el['R']);
        Ts.push(el['T']);
      }
      const switchesCartesianProduct = this.cartesianProductOf(Rs, Ts);

      for (const switchElement of switchesCartesianProduct) {
        parameters['R'] = switchElement[0];
        parameters['T'] = switchElement[1];
        this.apiService.processingWithKernel(parameters, this.tiffFileObject, this.tiffInfo).subscribe(
          response => {
            this.toastr.success(`Received ${this.tiffFileObject.name} </br> R:${switchElement[0]} </br> T:${switchElement[1]} </br> Method:${parameters['method']}`, 'Success');
            const blob = new Blob([response], { type: 'image/tiff' });
            FileSaver.saveAs(
              blob,
              `${ this.tiffFileObject.name.split(".")[0] }_R${ switchElement[0] }_T${ switchElement[1] }_${ parameters['method'] }.tif`
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
