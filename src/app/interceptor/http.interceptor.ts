import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "@services/auth.service";
import {environment} from "@env/environment";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if(!authService.IsLoggedIn)
    return next(req);

  if(!req.url.startsWith(environment.apiUrl) || req.url.endsWith("/auth/refresh"))
    return next(req);

  const newHeader : any = {
    Authorization: `Bearer ${authService.AccessToken}`
  }

  if(!authService.AccessToken)
    return next(req);

  req = req.clone({
    setHeaders: newHeader,
    withCredentials: true,
  })

  return next(req);
};
