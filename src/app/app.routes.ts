import { Routes } from '@angular/router';
import { CreateComponent } from './pages/project/create/create.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';

import { guestGuard } from './guards/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'project',
        children: [
          {
            path: 'create',
            component: CreateComponent,
            title: "Création d'un projet - ProjectConnect",
          },
        ],
      },
    ],
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Se connecter - ProjectConnect',
      },
      {
        path: 'forgot-password',
        component: ForgotComponent,
        title: 'Mot de passe oublié - ProjectConnect',
      },
      {
        path: 'password-reset/:token',
        component: PasswordResetComponent,
        title: 'Réinitialisation du mot de passe - ProjectConnect',
      },

      {
        path: 'register',
        component: RegisterComponent,
        title: 'Création du compte - ProjectConnect',
      },

      {
        path: 'verify-email/:userId/:hash',
        component: VerifyEmailComponent,
        title: "Vérification de l'adresse e-mail - ProjectConnect",
      },
    ],
    canActivate: [guestGuard],
  },
];
