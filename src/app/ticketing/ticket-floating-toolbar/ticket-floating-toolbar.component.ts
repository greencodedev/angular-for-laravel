import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {TicketsService} from '../tickets.service';
import {MailboxTagsService} from '../mailbox-tags.service';
import {Toast} from '../../../common/core/ui/toast.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';

@Component({
    selector: 'ticket-floating-toolbar',
    templateUrl: './ticket-floating-toolbar.component.html',
    styleUrls: ['./ticket-floating-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TicketFloatingToolbarComponent {

    /**
     * Ids of currently selected tickets;
     */
    @Input() selectedTickets: number[];

    /**
     * Fired when selected tickets have been updated in any way.
     */
    @Output() onTicketsUpdated = new EventEmitter();

    /**
     * TicketFloatingToolbarComponent Constructor.
     */
    constructor(
        private tickets: TicketsService,
        public mailboxTags: MailboxTagsService,
        private toast: Toast,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    /**
     * Delete tickets matching given ids.
     */
    public deleteTickets(ids: number[]) {
        this.tickets.deleteMultiple(ids).subscribe(() => {
            this.ticketsUpdated();
            this.toast.open('Tickets deleted');
        });
    }

    /**
     * Change status of all selected tickets.
     */
    public setStatusForSelectedTickets(tag) {
        this.tickets.changeMultipleTicketsStatus(this.selectedTickets.slice(), tag).subscribe(() => {
            this.ticketsUpdated();
        });
    }

    /**
     * Delete selected tickets if user confirms it.
     */
    public maybeDeleteSelectedTickets() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tickets',
            body:  'Are you sure you want to permanently delete selected tickets?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteTickets(this.selectedTickets.slice());
        });
    }

    /**
     * Called every time selected tickets are updated in any way.
     */
    public ticketsUpdated() {
        this.onTicketsUpdated.emit();
        this.mailboxTags.refresh();
    }
}
