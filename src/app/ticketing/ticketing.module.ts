import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared.module';
import {routing} from './ticketing.routing';
import {MailboxComponent} from './mailbox/mailbox.component';
import {TicketFloatingToolbarComponent} from './ticket-floating-toolbar/ticket-floating-toolbar.component';
import {AgentMailboxTicketListComponent} from './agent-mailbox-ticket-list/agent-mailbox-ticket-list.component';
import {AgentSearchModalComponent} from './agent-search-modal/agent-search-modal.component';
import {TicketsService} from './tickets.service';
import {ConversationModule} from '../conversation/conversation.module';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserProfileResolve} from './user-profile/user-profile-resolve.service';
import {UiModule} from '../../common/core/ui/ui.module';
import {
    MatAutocompleteModule, MatDialogModule,
    MatMenuModule,
    MatPaginatorModule, MatSidenavModule,
    MatSortModule,
    MatTableModule
} from '@angular/material';
import {TicketSearchDropdownComponent} from './ticket-search-dropdown/ticket-search-dropdown.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import {TextEditorModule} from '../../common/text-editor/text-editor.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        ConversationModule,
        TextEditorModule,
        UiModule,
        routing,

        // material
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatDialogModule,
        MatSidenavModule,
    ],
    declarations: [
        MailboxComponent,
        TicketFloatingToolbarComponent,
        AgentMailboxTicketListComponent,
        TicketSearchDropdownComponent,
        AgentSearchModalComponent,
        UserProfileComponent,
        CreateTicketComponent,
    ],
    entryComponents: [
        AgentSearchModalComponent,
    ],
    providers: [
        TicketsService,
        UserProfileResolve,
    ]
})
export class TicketingModule {
}
