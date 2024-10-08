import {Injectable} from '@angular/core';
import {EContentType} from "@constants/e-content-type";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly fileType: Record<string, EContentType> = {}

  constructor() {
    this.initFileType();
  }

  public typeByMime(mimeType? : string) : EContentType {
    if(!mimeType)
      return EContentType.Unknown;

    return this.fileType[mimeType] ?? EContentType.Unknown;
  }




  // INITIALIZATIONS

  private initFileType(){
    this.fileType["image/jpeg"] = EContentType.Image;
    this.fileType["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = EContentType.Sheet;
  }
}
