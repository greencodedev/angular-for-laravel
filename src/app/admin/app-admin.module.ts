import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {DatepickerComponent} from '../shared/datepicker/datepicker.component';
import {AppAdminRoutingModule} from './app-admin-routing.module';
import {TagsComponent} from './tags/tags.component';
import {ReportsComponent} from './reports/reports.component';
import {EnvatoReportsComponent} from './reports/envato-reports/envato-reports.component';
import {TicketsReportComponent} from './reports/tickets-report/tickets-report.component';
import {CrupdateTagModalComponent} from './tags/crupdate-tag-modal/crupdate-tag-modal.component';
import {EarningsChartComponent} from './reports/envato-reports/earnings-chart/earnings-chart.component';
import {PercentageChangeComponent} from './reports/percentage-change/percentage-change.component';
import {YearlyEarningsChartComponent} from './reports/envato-reports/yearly-earnings-chart/yearly-earnings-chart.component';
import {EarningsVsTicketsChartComponent} from './reports/envato-reports/earnings-vs-tickets-chart/earnings-vs-tickets-chart.component';
import {TicketsCountChartComponent} from './reports/tickets-report/tickets-count-chart/tickets-count-chart';
import {TicketsByTagsChartComponent} from './reports/tickets-report/tickets-by-tags-chart/tickets-by-tag-chart';
import {FirstResponseByHoursChartComponent} from './reports/tickets-report/first-response-by-hours-chart/first-response-by-hours-chart';
import {TicketsByHourChartComponent} from './reports/tickets-report/tickets-by-hour-chart/tickets-by-hour-chart.component';
import {EnvatoSettingsComponent} from './settings/envato/envato-settings.component';
import {HelpCenterSettingsComponent} from './settings/help-center/help-center-settings.component';
import {RealtimeSettingsComponent} from './settings/realtime/realtime-settings.component';
import {TicketingSettingsComponent} from './settings/ticketing/ticketing-settings.component';
import {TriggerComponent} from './triggers/triggers.component';
import {ConditionsComponent} from './triggers/conditions/conditions.component';
import {TriggersService} from './triggers/triggers.service';
import {TriggerResolve} from './triggers/trigger-resolve.service';
import { CannedRepliesComponent } from './canned-replies/canned-replies.component';
import {ConversationModule} from '../conversation/conversation.module';
import {SearchSettingsComponent} from './settings/search/search-settings.component';
import {CrupdateTriggerComponent} from './triggers/crupdate-trigger/crupdate-trigger.component';
import {BaseAdminModule} from '../../common/admin/base-admin.module';
import { TicketCategoriesComponent } from './ticket-categories/ticket-categories.component';
import { CrupdateTicketCategoryModalComponent } from './ticket-categories/crupdate-ticket-category-modal/crupdate-ticket-category-modal.component';
import {MatAutocompleteModule, MatListModule, MatProgressBarModule} from '@angular/material';

@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        BaseAdminModule,
        AppAdminRoutingModule,
        ConversationModule,

        // material
        MatAutocompleteModule,
        MatListModule,
        MatProgressBarModule,
    ],
    declarations: [
        TagsComponent,
        DatepickerComponent,
        CrupdateTagModalComponent,
        CannedRepliesComponent,

        // triggers
        TriggerComponent,
        ConditionsComponent,
        CrupdateTriggerComponent,

        // reports
        ReportsComponent,
        EnvatoReportsComponent,
        TicketsReportComponent,
        EarningsChartComponent,
        PercentageChangeComponent,
        EarningsVsTicketsChartComponent,
        YearlyEarningsChartComponent,
        TicketsCountChartComponent,
        TicketsByTagsChartComponent,
        FirstResponseByHoursChartComponent,
        TicketsByHourChartComponent,

        // settings
        EnvatoSettingsComponent,
        HelpCenterSettingsComponent,
        RealtimeSettingsComponent,
        TicketingSettingsComponent,
        SearchSettingsComponent,
        TicketCategoriesComponent,
        CrupdateTicketCategoryModalComponent,
    ],
    entryComponents: [
        CrupdateTagModalComponent,
        CrupdateTicketCategoryModalComponent,
    ],
    exports:      [],
    providers:    [
        TriggersService,
        TriggerResolve,
    ]
})
export class AppAdminModule { }
