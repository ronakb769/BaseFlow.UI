import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserComponent } from './components/user/user.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleComponent } from './components/role/role.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginHistoryComponent } from './components/login-history/login-history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { AppSettingsListComponent } from './components/app-settings-list/app-settings-list.component';

export const routes: Routes = [
     // Public routes - no layout, no AuthGuard
  { path: 'login', component: LoginComponent }, // Lazy load LoginComponent
  { path: 'forgetpassword', component: ForgetPasswordComponent},
  { path: 'resetpassword',component: ResetPasswordComponent},

  // Protected routes - under LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuard], // Protect all children
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'user-list', component: UserListComponent },
      { path: 'user-edit/:id',component:UserComponent},
      { path: 'user-create', component: UserComponent },
      { path: 'role-list', component:RoleListComponent },
       { path: 'role-edit/:id',component:RoleComponent},
      { path: 'role-create',component: RoleComponent},
      {path:'login-history',component:LoginHistoryComponent },
      {path: 'profile', component:ProfileComponent},
      { path: 'app-settings-list', component: AppSettingsListComponent},
       { path: 'edit-app-settings/:id',component:AppSettingsComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }

];
