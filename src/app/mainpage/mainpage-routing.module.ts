import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsPage } from '../settings/settings.page';

import { MainPage } from './mainpage.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'settings',
    component: SettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
