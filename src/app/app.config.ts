import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import { routes } from './app.routes';
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";
import {downloadFactory, storageFactory} from "@factory/abstract-provider-factory";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {initialize} from "@factory/initializer";
import {AuthService} from "@services/auth.service";
import {httpInterceptor} from "@interceptor/http.interceptor";
import {ProfileService} from "@services/profile.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {provideAnimations} from "@angular/platform-browser/animations";
import {refreshSessionInterceptor} from "@interceptor/refresh-session.interceptor";
import {AbstractDownloadService} from "@services/abstracts/downloads/abstract-download-service";
import {provideOAuthClient} from "angular-oauth2-oidc";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([httpInterceptor, refreshSessionInterceptor])),
    provideRouter(routes),
    provideOAuthClient(),
    {
      provide: AbstractStorageService,
      useFactory: storageFactory,
      deps: []
    },
    {
      provide: AbstractDownloadService,
      useFactory: downloadFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      multi: true,
      deps: [AuthService, ProfileService]
    },
    MessageService,
    NgxImageCompressService,
    provideAnimations(),
    ConfirmationService,
  ]
};
