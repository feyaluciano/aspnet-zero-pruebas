import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BusinessComponent } from './business/business.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListsComponent } from './lists/lists.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'business', component: BusinessComponent },
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'lists', component: ListsComponent },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
