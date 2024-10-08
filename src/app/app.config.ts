import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, RouteReuseStrategy, RouterModule} from '@angular/router';

import { routes } from './app.routes';
import {AbstractStorageService} from "./services/abstracts/storage/abstract.storage.service";
import {storageFactory} from "./factory/abstract-provider-factory";
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {initialize} from "./factory/initializer";
import {AuthService} from "./services/auth.service";
import {httpInterceptor} from "./interceptor/http.interceptor";
import {ProfileService} from "./services/profile.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {provideAnimations} from "@angular/platform-browser/animations";
import {refreshSessionInterceptor} from "./interceptor/refresh-session.interceptor";
import { CustomReuseStrategy } from './strategy/route-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([httpInterceptor, refreshSessionInterceptor])),
    provideRouter(routes),
    {
      provide: AbstractStorageService,
      useFactory: storageFactory,
      deps: []
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
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy
    }
  ]
};
