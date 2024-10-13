import {AbstractDownloadService} from "@services/abstracts/downloads/abstract-download-service";
import { Observable } from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class BrowserDownloadService extends AbstractDownloadService {

    override download(url: string, customFileName: string): Observable<boolean>  {
      return new Observable<boolean>((observer) => {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = customFileName;
            a.click();
            URL.revokeObjectURL(objectUrl);
            observer.next(true);
            observer.complete();
          })
          .catch(error => {
            console.error('Download failed:', error);
            observer.error(error);
          });
      });
    }


}
