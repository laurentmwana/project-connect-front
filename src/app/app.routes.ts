import { Routes } from '@angular/router';
import { CreateComponent } from './pages/project/create/create.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';

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
      },
      {
        path: 'forgot-password',
        component: ForgotComponent,
      },
      {
        path: 'password-reset/:token',
        component: PasswordResetComponent,
      },
    ],
  },
];
