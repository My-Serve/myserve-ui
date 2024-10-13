import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ToastService} from "@services/toast.service";
import {SpinnerService} from "@services/spinner.service";
import {ProfileService} from "@services/profile.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {convertOffsetToDate} from "@utils/string.utils";

@Component({
  selector: 'app-otp-callback',
  standalone: true,
  imports: [],
  templateUrl: './otp-callback.component.html',
  styles: ``
})
export class OtpCallbackComponent implements OnInit{

  emailAddress?: string;
  code?: string;
  expiry?: Date;
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly spinnerService: SpinnerService,
    private readonly profileService: ProfileService,
  ) {

  }

  async ngOnInit() {
    const spinnerLock = this.spinnerService.create("Authenticating...");
    try {
      const urlTree = this.router.parseUrl(this.router.url);
      const expiry = urlTree.queryParamMap .get("expiry")!;
      this.emailAddress = urlTree.queryParamMap.get("email") ?? undefined;
      this.code = urlTree.queryParamMap.get("code") ?? undefined;
      this.expiry = urlTree.queryParamMap.get("expiry") === null ? undefined :  convertOffsetToDate(expiry);

      if(!this.emailAddress || !this.code || !this.expiry){
        spinnerLock.release()
        await this.router.navigate(['auth'])
        return;
      }

      const current = new Date(new Date().toISOString());
      if(current > this.expiry) {
        spinnerLock.release();
        this.toastService.error(EToastConstants.Error, "The provided code has been expired")
        await this.router.navigate(['auth'])
        return;
      }

      this.authService.validateOtp({
        code: this.code,
        email: this.emailAddress
      }).subscribe({
        next: value => {
          spinnerLock.release();
          if(!value){
            this.toastService.error(EToastConstants.Error, 'Failed to validate your OTP')
            return
          }

          this.profileService.getProfile().subscribe({
            next: async (response) => {
              if(response){
                await this.router.navigate(['home'])
                return;
              }

              if(!await this.profileService.hasProfile()){
                await this.router.navigate(['profile'])
              }else{
                await this.router.navigate(['home'])
                return;
              }
            },
            error: (error) => {
              spinnerLock.release();
              this.toastService.error(EToastConstants.Error, 'An unknown error happened while validating your otp')
              this.router.navigate(['auth'])
            }
          })
        },
        error: err => {
          spinnerLock.release();
          console.error(err)
          this.router.navigate(['auth'])
        }
      })
    }catch (err){
      spinnerLock.release();
      console.error(err)
      await this.router.navigate(['auth'])
    }
  }



}
