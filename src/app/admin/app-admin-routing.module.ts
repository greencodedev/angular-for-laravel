import {RouterModule, Routes} from '@angular/router';
import {TicketsReportComponent} from './reports/tickets-report/tickets-report.component';
import {EnvatoReportsComponent} from './reports/envato-reports/envato-reports.component';
import {ReportsComponent} from './reports/reports.component';
import {TagsComponent} from './tags/tags.component';
import {EnvatoSettingsComponent} from './settings/envato/envato-settings.component';
import {HelpCenterSettingsComponent} from './settings/help-center/help-center-settings.component';
import {TicketingSettingsComponent} from './settings/ticketing/ticketing-settings.component';
import {RealtimeSettingsComponent} from './settings/realtime/realtime-settings.component';
import {NgModule} from '@angular/core';
import {TriggerComponent} from './triggers/triggers.component';
import {CrupdateTriggerComponent} from './triggers/crupdate-trigger/crupdate-trigger.component';
import {TriggerResolve} from './triggers/trigger-resolve.service';
import {CannedRepliesComponent} from './canned-replies/canned-replies.component';
import {SearchSettingsComponent} from './settings/search/search-settings.component';
import {AuthGuard} from '../../common/guards/auth-guard.service';
import {AdminComponent} from '../../common/admin/admin.component';
import {CheckPermissionsGuard} from '../../common/guards/check-permissions-guard.service';
import {SettingsComponent} from '../../common/admin/settings/settings.component';
import {SettingsResolve} from '../../common/admin/settings/settings-resolve.service';
import {vebtoSettingsRoutes} from '../../common/admin/settings/settings-routing.module';
import {vebtoAdminRoutes} from '../../common/admin/base-admin-routing.module';
import {TicketCategoriesComponent} from './ticket-categories/ticket-categories.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard, CheckPermissionsGuard],
        canActivateChild: [AuthGuard, CheckPermissionsGuard],
        data: {permissions: ['admin.access']},
        children: [
            {
                path: 'tags',
                component: TagsComponent, data: {permissions: ['tags.view']}
            },
            {
                path: 'ticket-categories',
                component: TicketCategoriesComponent, data: {permissions: ['tags.view']}
            },
            {
                path: 'canned-replies',
                component: CannedRepliesComponent,
                data: {permissions: ['canned_replies.view']}
            },
            {
                path: 'triggers',
                component: TriggerComponent,
                data: {permissions: ['triggers.view']}
            },
            {
                path: 'triggers/new',
                component: CrupdateTriggerComponent,
                data: {permissions: ['triggers.create']}
            },
            {
                path: 'triggers/:id/edit',
                component: CrupdateTriggerComponent,
                resolve: {trigger: TriggerResolve},
                data: {permissions: ['triggers.update']}
            },
            {
                path: 'analytics',
                component: ReportsComponent,
                data: {permissions: ['reports.view']},
                children: [
                    {path: '', redirectTo: 'conversations'},
                    {path: 'envato', component: EnvatoReportsComponent},
                    {path: 'conversations', component: TicketsReportComponent},
                ]
            },
            {
                path: 'settings',
                component: SettingsComponent,
                resolve: {settings: SettingsResolve},
                data: {permissions: ['settings.view']},
                children: [
                    {path: '', redirectTo: 'ticketing'},
                    {path: 'envato', component: EnvatoSettingsComponent},
                    {path: 'help-center', component: HelpCenterSettingsComponent},
                    {path: 'realtime', component: RealtimeSettingsComponent},
                    {path: 'ticketing', component: TicketingSettingsComponent},
                    {path: 'search', component: SearchSettingsComponent},
                    ...vebtoSettingsRoutes,
                ],
            },
            ...vebtoAdminRoutes,
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppAdminRoutingModule {
}
