import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../common/guards/auth-guard.service';

const routes: Routes = [
    {path: '', redirectTo: 'help-center', pathMatch: 'full'},
    {path: 'mailbox', loadChildren: 'app/ticketing/ticketing.module#TicketingModule'},
    {path: 'admin', loadChildren: 'app/admin/app-admin.module#AppAdminModule', canLoad: [AuthGuard]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
