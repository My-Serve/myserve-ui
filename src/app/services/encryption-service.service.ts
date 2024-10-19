import { Injectable } from '@angular/core';
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";
import {from, Observable, of, switchMap} from "rxjs";
import {StorageKeys} from "@others/storage/storage.keys";
import {PopUpService} from "@services/pop-up.service";

@Injectable({
  providedIn: 'root'
})
export class EncryptionServiceService {

  constructor(
    private readonly storageService: AbstractStorageService,
  ) { }


}
