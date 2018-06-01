import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainComponent} from './main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'product',
        loadChildren: './product/product.module#ProductModule'
      }, {
        path: 'order',
        loadChildren: './order/order.module#OrderModule'
      }, {
        path: 'promote',
        loadChildren: './promote/promote.module#PromoteModule'
      }, {
        path: 'customerService',
        loadChildren: './customer-service/customer-service.module#CustomerServiceModule'
      }, {
        path: 'report',
        loadChildren: './report/report.module#ReportModule'
      }, {
        path: 'account',
        loadChildren:'./account/account.module#AccountModule'
      }, {
        path: 'user',
        loadChildren:'./user/user.module#UserModule'
      }, {
        path: 'topic',
        loadChildren:'./topic/topic.module#TopicModule'
      }
    ]
  }, {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
