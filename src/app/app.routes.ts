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
import { AdminComponent } from './pages/admin/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { NotificationDetailComponent } from './pages/notification/notification-detail/notification-detail.component';
import { NotificationListComponent } from './pages/notification/notification-list/notification-list.component';

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
        path: 'projects',
        component: DisplayComponent,
      },
      {
        path: 'project/create',
        component: CreateComponent,
        title: "Création d'un projet - ProjectConnect",
        canActivate: [protectedGuard],
      },
      { path: 'project/:slug', component: ProjectDetailComponent },

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
            component: MessageComponent,
            canActivate: [protectedGuard],
          },
          {
            path: ':chatId',
            component: MessageComponent,
            title: 'Détail du chat - ProjectConnect',
            canActivate: [protectedGuard],
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Mon profil - ProjectConnect',
        canActivate: [protectedGuard],
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        title: 'Profil utilisateur - ProjectConnect',
        canActivate: [protectedGuard],
      },

      {
        path: 'notification',
        children: [
          {
            path: '',
            title: 'Notifications - ProjectConnect',
            component: NotificationListComponent,
          },

          {
            path: ':id',
            title: 'En savoir plus sur une notification - ProjectConnect',
            component: NotificationDetailComponent,
          },
        ],
        canActivate: [protectedGuard],
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

  //admin
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
];
