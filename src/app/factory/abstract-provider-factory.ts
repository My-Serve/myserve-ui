import {AbstractStorageService} from "../services/abstracts/storage/abstract.storage.service";
import {LocalStorageService} from "../services/abstracts/storage/local-storage.service";

export function storageFactory() : AbstractStorageService {
  return new LocalStorageService();
}
