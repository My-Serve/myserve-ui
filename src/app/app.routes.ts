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
    path: 'profile',
    canActivate: [authGuard],
    title: 'Create Profile | My Serve',
    loadComponent: () => import('./components/pages/dashboard/profile/profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: 'edit',
        canActivate: [authGuard],
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
        loadComponent: () => import('./components/pages/dashboard/home/files/files.component').then(m => m.FilesComponent),
        children: [
          {
            path: 'obj/:id',
            title: 'View | My Serve',
            loadComponent: () => import('./components/pages/dashboard/home/files/file-item/file-item.component').then(m => m.FileItemComponent),
          },
          {
            path: 'dir/:id',
            title: 'My Files | My Serve',
            loadComponent: () => import('./components/pages/dashboard/home/files/files.component').then(m => m.FilesComponent),
          },
        ],
      },
      {
        path: 'notes',
        title: 'My Notes | My Serve',
        loadComponent: () => import('./components/pages/dashboard/home/notes/notes.component').then(m => m.NotesComponent),
      },
      {
        path: 'passwords',
        title: 'My Password | My Serve',
        loadComponent: () => import('./components/pages/dashboard/home/password/password.component').then(m => m.PasswordComponent),
      },
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
