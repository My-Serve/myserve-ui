import {ActivatedRoute, CanActivateFn, NavigationEnd, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "@services/auth.service";
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";
import {StorageKeys} from "@others/storage/storage.keys";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storageService = inject(AbstractStorageService);
  if (!authService.IsLoggedIn) {
    if(!invalidRedirects.some(x => state.url.startsWith(x)) || !await storageService.getOrDefaultStringAsync(StorageKeys.RedirectTo, undefined)){
      await storageService.setStringAsync(StorageKeys.RedirectTo, state.url);
    }
    await router.navigate(['/auth']);
    return false;
  }

  return true;
};

const invalidRedirects: string[] = [
  "/auth",
  "/callback",
  "/profile"
]
