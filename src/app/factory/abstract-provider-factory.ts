import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";
import {LocalStorageService} from "@services/abstracts/storage/local-storage.service";
import {AbstractDownloadService} from "@services/abstracts/downloads/abstract-download-service";
import {BrowserDownloadService} from "@services/abstracts/downloads/browser-download-service";

export function storageFactory() : AbstractStorageService {
  return new LocalStorageService();
}

export function downloadFactory() : AbstractDownloadService{
  return new BrowserDownloadService
}
