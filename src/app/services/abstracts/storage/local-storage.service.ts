import {Injectable} from "@angular/core";
import {AbstractStorageService} from "./abstract.storage.service";
import {SKey} from "@others/storage/storage.keys";

@Injectable()
export class LocalStorageService extends AbstractStorageService {

  public async removeAsync(key: SKey): Promise<boolean> {
    localStorage.removeItem(key.asKey())
    return true;
  }

  public async setStringAsync(key: SKey, value: string): Promise<boolean> {
    localStorage.setItem(key.asKey(), value);
    return true;
  }

  public async getOrDefaultStringAsync(key: SKey, defaultValue?: string | undefined): Promise<string | undefined | null> {
    const itemString = localStorage.getItem(key.asKey());
    if(!itemString)
      return defaultValue;

    return itemString;
  }

  public async getOrDefaultAsync<T>(key: SKey, defaultValue? : T | null): Promise<T | undefined | null> {
    const itemString = localStorage.getItem(key.asKey());
    if(!itemString)
      return defaultValue;

    return JSON.parse(itemString);
  }

  public async setAsync<T>(key: SKey, value: T): Promise<boolean> {
    localStorage.setItem(key.asKey(), JSON.stringify(value));
    return true;
  }



}
