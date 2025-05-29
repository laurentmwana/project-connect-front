import { Routes } from '@angular/router';
import { CreateComponent } from './pages/project/create/create.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DisplayComponent } from './pages/project/display/display.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: DisplayComponent,
      },
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
    ],
  },
  {
    path: 'projectsss',
    component: DisplayComponent,
  },
];
