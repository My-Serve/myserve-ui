import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {TooltipModule} from "primeng/tooltip";
import {Button} from "primeng/button";
import {generateRandomAlphanumeric} from "@utils/string.utils";
import {Router} from "@angular/router";
import {ProfileService} from "@services/profile.service";
import {ToastService} from "@services/toast.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {IProfileCreateCommand} from "@models/profile-model";
import {PasswordModule} from "primeng/password";
import {PopUpService} from "@services/pop-up.service";
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";
import {StorageKeys} from "@others/storage/storage.keys";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    AvatarModule,
    TooltipModule,
    Button,
    PasswordModule,
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  protected readonly form: FormGroup;
  protected selectedFile : null | File = null;
  protected readonly isEdit: boolean = false;

  constructor(
    protected readonly router: Router,
    protected readonly profileService: ProfileService,
    protected readonly toastService: ToastService,
    private readonly popupService: PopUpService,
    private readonly storageService: AbstractStorageService
  ) {
    this.form = new FormGroup({
      profilePicture: new FormControl<string>('', []),
      firstName: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      encKey: new FormControl<string>('', [Validators.required, Validators.maxLength(40)])
    })

    if (this.router.url.includes("edit")) {
      this.isEdit = true;
    }
  }

  async ngOnInit()  {
    if(this.isEdit){
      const encKey = await this.storageService.getOrDefaultStringAsync(StorageKeys.EncryptionKey, "")
      this.profileService.getProfile().subscribe({
        next: value => {

          this.form.patchValue({
            profilePicture: value?.profileImageUrl,
            firstName: value?.firstName,
            lastName: value?.lastName,
            encKey: encKey
          })
          console.log(this.form.value)
          this.form.get("encKey")?.disable();
        },
        error: async err => {
          await this.router.navigate(['profile']);
        }
      })
    }
  }

  public async selectImage(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.form.patchValue({
        profilePicture: URL.createObjectURL(this.selectedFile),
      })
    }
  }

  public get profilePicture() : string | undefined {
    return this.form.get('profilePicture')?.value ?? undefined
  }

  public clickProfile(){
    if(this.profilePicture){
      this.form.patchValue({
        profilePicture: undefined
      })
    }else{
      this.fileInput.nativeElement.click();
    }
  }

  generateRandomEnc() {
    const randomEnc = generateRandomAlphanumeric(20);
    this.form.patchValue({
      encKey: randomEnc,
    })
  }

  async save(){
    if(this.form.invalid){
      this.toastService.error(EToastConstants.FormInvalid, "Please completely fill out the fields")
      return;
    }

    const encKey = this.form.get('encKey')!.value;

    const body : IProfileCreateCommand = {
      firstName: this.form.get('firstName')!.value,
      lastName: this.form.get('lastName')!.value,
      settings: undefined,
      imageFile: this.selectedFile,
      contentType: this.selectedFile === null || typeof this.selectedFile === 'undefined' ? null : this.selectedFile.type
    }

    const accepted = await this.popupService.confirm("The encryption key you provided should be used to encrypt all private and won't be stored in server. If lost, your data would be lost", "Note",
      {
        acceptText: 'I Understand',
        noText: 'Reject'
      }
    );
    if(!accepted)
    {
      this.toastService.warning(EToastConstants.Warning, "Please accept the encryption key notice!");
      return
    }

    if(!this.isEdit){
      this.profileService.create(body)
        .subscribe({
          next: value => {
            this.form.reset();
            this.storageService.setStringAsync(StorageKeys.EncryptionKey, encKey);
          },
          error: err => {
            console.error(err)
          }
        })
    }else{

    }
  }
}
