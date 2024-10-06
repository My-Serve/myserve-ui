import {SKey} from "../../../others/storage/storage.keys";

export abstract class AbstractStorageService {

  abstract setStringAsync(key: SKey, value: string): Promise<boolean>

  abstract getOrDefaultStringAsync(key: SKey, defaultValue? : string | undefined) : Promise<string | undefined | null>
  abstract getOrDefaultAsync<T>(key: SKey, defaultValue? : T | undefined) : Promise<T | undefined | null>

  abstract setAsync<T>(key: SKey, value: T): Promise<boolean>

  abstract removeAsync(key: SKey): Promise<boolean>

}
