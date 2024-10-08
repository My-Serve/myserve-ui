import {AuthService} from "@services/auth.service";
import {ProfileService} from "@services/profile.service";

export function initialize(authService: AuthService, profileService: ProfileService) : () => Promise<void> {
  return () => new Promise(async (resolve) => {
    const present = await authService.initialize();
    if(!present)
      resolve();

    await profileService.initialize()
    resolve();
  })
}
