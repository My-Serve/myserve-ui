import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ProfileService} from "@services/profile.service";

export const profileGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (await profileService.hasProfile()) {
    return true;
  }

  await router.navigate(['/profile'], {queryParams: route.url});
  return false;
};
