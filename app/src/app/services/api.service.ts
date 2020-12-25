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

  processingWithKernel(parameters: FormArray, tiff: File, tiffInfo: { name: string, width: number, height: number, pages: number, currentPage: number }): Observable<any> {
    parameters['filename'] = tiffInfo.name;
    parameters['pages'] = tiffInfo.pages;
    parameters['X'] = tiffInfo.width;
    parameters['Y'] = tiffInfo.height;

    const formData = new FormData();
    formData.append('image', tiff);
    formData.append('processing_info', JSON.stringify(parameters));

    return this.http.post(
      this.baseUrl + '/kernel_processing/',
      formData,
      { responseType: 'blob' }
    );
  }
}
