import { NgModule } from '@angular/core';
import { Routes, RouterModule,ExtraOptions } from '@angular/router';
//import { AuthGuardService } from './core/services';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },

  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule),
  },
  {
    path: '#',
    redirectTo: 'login',
  }
];
const config: ExtraOptions = {
  useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes,config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
