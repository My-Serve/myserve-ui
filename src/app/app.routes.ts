import { Routes } from '@angular/router';
import {authGuard} from "@guard/auth.guard";
import {profileGuard} from "@guard/profile.guard";

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./components/pages/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
    title: 'Login to My Serve',
    children: []
  },
  {
    path: 'callback',
    children: [
      {
        path: 'google',
        title: 'Google OAuth | Please wait',
        loadComponent: () => import('./components/pages/auth/sign-in/google-callback/google-callback.component').then(m => m.GoogleCallbackComponent),
      },
      {
        path: 'otp',
        title: 'OTP Validation | Please wait',
        loadComponent: () => import('./components/pages/auth/sign-in/otp-callback/otp-callback.component').then(m => m.OtpCallbackComponent),
      }
    ]
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        title: 'Create Profile | My Serve',
        loadComponent: () => import('./components/pages/dashboard/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'edit',
        canActivate: [authGuard, profileGuard],
        title: 'Edit Profile | My Serve',
        loadComponent: () => import('./components/pages/dashboard/profile/profile.component').then(m => m.ProfileComponent),
      },
    ],
  },
  {
    path: 'home',
    canActivate: [authGuard, profileGuard],
    loadComponent: () => import('./components/pages/dashboard/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'calendar',
        title: 'Calendar | My Serve',
        loadComponent: () => import('./components/pages/dashboard/home/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'files',
        title: 'My Files | My Serve',
        children: [
          {
            path: '',
            title: 'My Files | My Serve',
            loadComponent: () => import('./components/pages/dashboard/home/files/files.component').then(m => m.FilesComponent),
          },
          {
            path: 'dir/:id',
            title: 'My Files | My Serve',
            loadComponent: () => import('./components/pages/dashboard/home/files/files.component').then(m => m.FilesComponent),
          }
        ],
      },
      // {
      //   path: 'notes',
      //   title: 'My Notes | My Serve',
      //   loadComponent: () => import('./components/pages/dashboard/home/notes/notes.component').then(m => m.NotesComponent),
      // },
      // {
      //   path: 'passwords',
      //   title: 'My Password | My Serve',
      //   loadComponent: () => import('./components/pages/dashboard/home/password/password.component').then(m => m.PasswordComponent),
      // },
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: 'not-found',
    title: 'Not Found | My Serve',
    loadComponent: () => import('./components/shared/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
