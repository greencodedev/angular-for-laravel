import {RouterModule} from '@angular/router';
import {MailboxComponent} from './mailbox/mailbox.component';
import {AgentMailboxTicketListComponent} from './agent-mailbox-ticket-list/agent-mailbox-ticket-list.component';
import {ConversationComponent} from '../conversation/conversation.component';
import {TicketResolve} from '../conversation/conversation-resolve.service';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserProfileResolve} from './user-profile/user-profile-resolve.service';
import {AuthGuard} from '../../common/guards/auth-guard.service';
import {CreateTicketComponent} from './create-ticket/create-ticket.component';
import {NewTicketCategoriesResolve} from '../customer-mailbox/new-ticket-categories-resolve';

export const routing = RouterModule.forChild([
    {path: '', canActivateChild: [AuthGuard], children: [
        {
            path: '',
            redirectTo: 'tickets',
            pathMatch: 'full',
        },
        {
            path: 'tickets',
            component: MailboxComponent,
            data: {permissions: ['tickets.view']},
            children: [
                {path: '', component: AgentMailboxTicketListComponent},
            ]
        },
            {
                path: 'tickets/new',
                component: MailboxComponent,
                resolve: {categories: NewTicketCategoriesResolve},
                data: {permissions: ['tickets.create']},
                children: [
                    {path: '', component: CreateTicketComponent},
                ]
            },
        {
            path: 'tickets/tag/:tag_id',
            component: MailboxComponent,
            data: {permissions: ['tickets.view']},
            children: [
                {path: '', component: AgentMailboxTicketListComponent},
                {path: 'ticket/:ticket_id', component: ConversationComponent, resolve: {ticket: TicketResolve}},
            ]
        },
        {
            path: 'users/:id',
            component: UserProfileComponent,
            resolve: {user: UserProfileResolve},
            data: {permissions: ['users.view', 'tickets.view', 'tags.view']},
        }
    ]}
]);
