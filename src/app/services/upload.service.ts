import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {filter, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public upload(url: string, contentType: string, file: File): Observable<number> {
    const headers = new HttpHeaders({
      "Content-Type": contentType
    });

    return this.http.put(url, file, {
      headers: headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      filter(event => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return Math.round((event.loaded / (event.total || event.loaded)) * 100);
        } else if (event instanceof HttpResponse) {
          return 100;
        }
        return 0;
      })
    );
  }
}
