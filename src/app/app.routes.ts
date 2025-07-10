import { Routes } from '@angular/router';
import { CreateComponent } from './pages/project/create/create.component';
import { DisplayComponent } from './pages/project/display/display.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';

import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { guestGuard } from './guards/auth/guest.guard';
import { ProjectDetailComponent } from './pages/project/project-detail/project-detail.component';
import { protectedGuard } from './guards/protected.guard';
import { MessageComponent } from './pages/message/message.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProjectEditComponent } from './pages/project/project-edit/project-edit.component';
import { canEditGuard } from './guards/can-edit.guard';
export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: DisplayComponent,
        title: 'Projets - ProjectConnect',
      },
      {
        path: 'project/create',
        component: CreateComponent,
        title: "Création d'un projet - ProjectConnect",
        canActivate: [protectedGuard],
      },
      {
        path: 'project/edit/:slug',
        component: ProjectEditComponent,
        title: 'Modifier un projet - ProjectConnect',
        canActivate: [canEditGuard],
      },

      {
        path: 'message',
        title: 'Messagerie',
        children: [
          {
            path: '',
            component: MessageComponent, // inbox par défaut
          },
          {
            path: ':chatId',
            component: MessageComponent, // ou ChatDetailComponent si séparé
            title: 'Détail du chat - ProjectConnect',
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Mon profil - ProjectConnect',
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        title: 'Profil utilisateur - ProjectConnect',
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
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
  },
  // Route supplémentaire si besoin
  {
    path: 'projectsss',
    component: DisplayComponent,
  },
  { path: 'project/:slug', component: ProjectDetailComponent },
];
