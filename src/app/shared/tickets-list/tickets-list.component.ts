import {Component, ViewChild, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material';
import {Ticket} from '../models/Ticket';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {ConversationModalComponent} from '../../conversation/conversation-modal/conversation-modal.component';
import {MailboxTagsService} from '../../ticketing/mailbox-tags.service';

@Component({
    selector: 'tickets-list',
    templateUrl: './tickets-list.component.html',
    styleUrls: ['./tickets-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TicketsListComponent {
    @ViewChild(MatSort) matSort: MatSort;

    @Input() openTicketInModal = false;
    @Input() tickets: Ticket[] = [];

    @Output() ticketsSelected: EventEmitter<Ticket[]> = new EventEmitter();

    public selectedTickets: Ticket[] = [];

    constructor(
        private router: Router,
        private modal: Modal,
        private mailboxTags: MailboxTagsService,
    ) {}

    public openConversation(ticketId: number) {
        if (this.openTicketInModal) {
            this.modal.open(ConversationModalComponent, {ticketId}, {panelClass: 'conversation-modal-container'});
        } else {
            this.router.navigate(['/mailbox/tickets/tag', this.mailboxTags.getActiveTagId(), 'ticket', ticketId]);
        }
    }

    public toggleTicket(ticket: Ticket) {
        const i = this.selectedTickets.indexOf(ticket);
        if (i > -1) {
            this.selectedTickets.splice(i, 1);
        } else {
            this.selectedTickets.push(ticket);
        }

        this.ticketsSelected.emit(this.selectedTickets.slice());
    }

    public toggleAllTickets() {
        if (this.allTicketsSelected()) {
            this.selectedTickets = [];
        } else {
            this.selectedTickets = this.tickets.slice();
        }

        this.ticketsSelected.emit(this.selectedTickets.slice());
    }

    public allTicketsSelected() {
        return this.tickets.length && this.selectedTickets.length === this.tickets.length;
    }

    public anyTicketSelected() {
        return this.selectedTickets.length > 0;
    }

    public ticketSelected(ticket: Ticket) {
        return this.selectedTickets.indexOf(ticket) > -1;
    }

    public getTicketBody(ticket: Ticket): string {
        if (ticket.latest_reply && ticket.latest_reply.body) {
            return ticket.latest_reply.body;
        }

        if (ticket.replies && ticket.replies.length) {
            return ticket.replies[0].body;
        }
    }
}
