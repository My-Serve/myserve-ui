import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ProfileService} from "@services/profile.service";
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";

export const profileGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const storageService = inject(AbstractStorageService);
  const router = inject(Router);

  if (await profileService.hasProfile()) {
    return true;
  }

  await router.navigate(['/profile']);
  return false;
};
