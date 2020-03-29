import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'mask-map',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mask-map/mask-map.module').then(m => m.MaskMapPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/mask-map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/mask-map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
