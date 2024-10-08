import {Component, OnDestroy, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {AuthService} from "../../../../services/auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AbstractStorageService} from "../../../../services/abstracts/storage/abstract.storage.service";
import {StorageKeys} from "../../../../others/storage/storage.keys";
import {InputOtpModule} from "primeng/inputotp";
import {TooltipModule} from "primeng/tooltip";
import {UtilityService} from "../../../../services/utility.service";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {ToastService} from "../../../../services/toast.service";
import {EToastConstants} from "../../../../constants/e-toast-constants";
import {ProfileService} from "../../../../services/profile.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CardModule,
    Button,
    FaIconComponent,
    DividerModule,
    InputTextModule,
    InputOtpModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent implements OnInit, OnDestroy {

  protected isOtpRequested: boolean = false;
  private lastOtpRequestedOn: Date | null = null;
  protected code: string | null = null;
  protected emailAddress : string | null = null;
  protected interval: ReturnType<typeof setTimeout>;
  protected otpText : string | null = null;

  protected isEmailRequesting: boolean = false;
  protected loading: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly storageService : AbstractStorageService,
    private readonly utilityService: UtilityService,
    private readonly toastService: ToastService,
    private readonly profileService: ProfileService,
    private readonly router: Router
  ) {
    this.interval = setInterval(() => {
      this.otpText = this.smallHelpText();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  async ngOnInit(): Promise<void> {
    const lastEmail = await this.storageService.getOrDefaultStringAsync(StorageKeys.LastPersistedEmailKey);
    if(lastEmail)
      this.emailAddress = lastEmail;

    if(this.authService.IsLoggedIn)
      await this.authService.logout();
  }

  public async requestOtp(): Promise<void> {
    this.code = '';

    if(!this.emailAddress)
      return;

    await this.storageService.setStringAsync(StorageKeys.LastPersistedEmailKey, this.emailAddress);
    if(!this.valid())
      return;

    this.isEmailRequesting = true;
    this.loading = true;

    this.authService.loginWithOtp({emailAddress: this.emailAddress})
      .subscribe({
        next: (response) => {
          this.isEmailRequesting = false;
          this.loading = false;

          if(response && response.success){
            this.isOtpRequested = true;
            this.lastOtpRequestedOn = new Date()
            this.toastService.info(EToastConstants.Success, 'Verification code will be sent to your email if an account exists!')
          }
        },
        error: err => {
          this.isEmailRequesting = false;
          this.loading = false;
          this.toastService.error(EToastConstants.Error, err.message || 'An unknown error occurred while processing your request');
          console.log(err);
        }
      });
  }

  valid(): boolean {
    if(!this.emailAddress)
      return false;

    if(!this.utilityService.validateEmailAddress(this.emailAddress))
      return false;

    if (this.lastOtpRequestedOn) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (this.lastOtpRequestedOn > oneMinuteAgo) {
        return false;
      }
    }

    if(this.loading)
      return false;

    return true;
  }

  toolTip() : string | undefined {
    if(!this.emailAddress)
      return 'Please provide an email address';

    if(!this.utilityService.validateEmailAddress(this.emailAddress))
      return 'The provided email address is not valid';

    if (this.lastOtpRequestedOn) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (this.lastOtpRequestedOn > oneMinuteAgo) {
        return 'Please wait to resent the email address';
      }
    }

    return 'Request for an OTP';
  }

  smallHelpText(): string {
    if (!this.lastOtpRequestedOn) {
      return '';
    }

    const oneMinuteInMillis = 60 * 1000;
    const timePassed = Date.now() - this.lastOtpRequestedOn.getTime();

    if (timePassed < oneMinuteInMillis) {
      const remainingTime = oneMinuteInMillis - timePassed;
      const seconds = Math.ceil(remainingTime / 1000);
      return `You can request an OTP in ${seconds} seconds`;
    }

    return 'You can request an OTP now';
  }

  onEnterCode() {
    if (!this.code) {
      return
    }

    this.code = this.code.toUpperCase();

    if(this.code.length !== 6)
      return;

    if(!this.emailAddress)
      return;

    if(!this.utilityService.validateEmailAddress(this.emailAddress))
      return;

    this.loading = true;

    this.authService.validateOtp({
      email: this.emailAddress!,
      code: this.code,
    }).subscribe({
      next: value => {
        this.loading = false;
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
            console.error(error)
          }
        })
      },
      error: err => {
        this.loading = false;
        console.error(err)
      }
    })
  }

}
