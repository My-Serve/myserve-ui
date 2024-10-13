import {Observable} from "rxjs";

export abstract class AbstractDownloadService {

  abstract download(url: string, customFileName: string): Observable<boolean>;

}
