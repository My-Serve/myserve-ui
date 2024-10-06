import {HttpErrorResponse, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, filter, from, map, of, switchMap, take, throwError} from "rxjs";
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

let isRefreshing: boolean = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const refreshSessionInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl) || !req.headers.has('Authorization')) {
    return next(req);
  }

  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if(!(err instanceof HttpErrorResponse) || !req.headers.has("Authorization"))
        return throwError(() => err);

      if(err.status !== 401)
        return throwError(() =>  err);

      if(!authService.RefreshToken || req.url.endsWith("/auth/refresh"))
        return throwError(() =>  err);


      if(isRefreshing){
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(() => next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${authService.AccessToken}`
            }
          })))
        )
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refresh().pipe(
        switchMap((res) => {
          if(!res)
            return throwError(() =>  err);

          isRefreshing = false;
          refreshTokenSubject.next(res.refreshToken);
          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.accessToken}`
            }
          }))
        }),
        catchError((err) => {
          isRefreshing = false;
          return from(authService.logout()).pipe(
            switchMap(() => {
              return throwError(() =>  err);
            })
          )
        })
      )
    })
  );
};


