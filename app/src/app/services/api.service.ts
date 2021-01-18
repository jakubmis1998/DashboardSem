import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://158.75.112.204:4444';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  systemUsage(): Observable<any> {
    return this.http.get(
      this.baseUrl + '/system_usage/',
      { headers: this.httpHeaders }
    );
  }

  processingProgress(): Observable<any> {
    return this.http.get(
      this.baseUrl + '/processing_progress/',
      { headers: this.httpHeaders }
    );
  }

  processingWithKernel(apiParameters: any, tiff: File, mask: File, tiffInfo: { name: string, width: number, height: number, pages: number, currentPage: number }): Observable<any> {
    apiParameters['filename'] = tiff.name;
    apiParameters['pages'] = tiffInfo.pages;
    apiParameters['X'] = tiffInfo.width;
    apiParameters['Y'] = tiffInfo.height;

    const formData = new FormData();
    formData.append('image', tiff);
    formData.append('mask', mask);
    formData.append('processing_info', JSON.stringify(apiParameters));
    console.log(tiff);

    return this.http.post(
      this.baseUrl + '/kernel_processing/',
      formData,
      { responseType: 'blob' }
    );
  }

  processingWithJar(apiParameters: any, tiff: File, mask: File, tiffInfo: { name: string, width: number, height: number, pages: number, currentPage: number }): Observable<any> {
    apiParameters['filename'] = tiff.name;
    apiParameters['pages'] = tiffInfo.pages;

    const formData = new FormData();
    formData.append('image', tiff);
    formData.append('mask', mask);
    formData.append('processing_info', JSON.stringify(apiParameters));

    return this.http.post(
      this.baseUrl + '/jar_processing/',
      formData,
      { responseType: 'blob' }
    );
  }
}
