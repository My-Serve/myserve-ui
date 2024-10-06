import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {TooltipModule} from "primeng/tooltip";
import {Button} from "primeng/button";
import {generateRandomAlphanumeric} from "../../../../utils/string.utils";
import {Router} from "@angular/router";
import {ProfileService} from "../../../../services/profile.service";
import {ToastService} from "../../../../services/toast.service";
import {EToastConstants} from "../../../../constants/e-toast-constants";
import {IProfileCreateCommand} from "../../../../models/profile-model";

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
    protected readonly toastService: ToastService
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

  ngOnInit(): void {
    if(this.isEdit){
      this.profileService.getProfile().subscribe({
        next: value => {

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

  save(){
    if(this.form.invalid){
      this.toastService.error(EToastConstants.FormInvalid, "Please completely fill out the fields")
      return;
    }

    const body : IProfileCreateCommand = {
      firstName: this.form.get('firstName')!.value,
      lastName: this.form.get('lastName')!.value,
      encryptionKey: this.form.get('encKey')!.value,
      settings: undefined,
      imageFile: this.selectedFile,
      contentType: this.selectedFile === null || typeof this.selectedFile === 'undefined' ? null : this.selectedFile.type
    }

    this.profileService.create(body)
      .subscribe({
        next: value => {
          console.log(value)
        },
        error: err => {
          console.error(err)
        }
      })
  }
}
