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

  sendParametrizedImage(tiffFile: File, parameters: FormArray, download = false): Observable<any> {
    const formData = new FormData();
    formData.append('image', tiffFile);
    formData.append('parameters', JSON.stringify(parameters));

    if (download) {
      console.log('SEND FILE AND DOWNLOAD');
      return this.http.post(
        this.baseUrl + '/read_and_return/',
        formData,
        { responseType: 'blob' }
      );
    } else {
      console.log('SEND FILE AND CALCULATE');
      return this.http.post(
        this.baseUrl + '/image_processing/',
        formData
      );
    }
  }

  systemUsage(): Observable<any> {
    return this.http.get(
      this.baseUrl + '/system_usage/',
      { headers: this.httpHeaders }
    );
  }

  processingWithKernel(postBody: FormData): Observable<any> {
    return this.http.post(
      this.baseUrl + '/kernel_processing/',
      postBody,
      { responseType: 'blob' }
    );
  }
}
