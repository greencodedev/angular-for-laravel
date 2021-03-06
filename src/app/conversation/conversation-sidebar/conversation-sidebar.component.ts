import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConversationModalComponent} from '../conversation-modal/conversation-modal.component';
import {User} from '../../shared/models/User';
import {Ticket} from '../../shared/models/Ticket';
import {Conversation} from '../conversation.service';
import {TicketsService} from '../../ticketing/tickets.service';
import {ActivatedRoute} from '@angular/router';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {PurchaseCode} from '../../shared/models/PurchaseCode';
import {FindUsersModalComponent} from '../../../common/auth/find-users-modal/find-users-modal.component';
import {Toast} from '../../../common/core/ui/toast.service';

@Component({
    selector: 'conversation-sidebar',
    templateUrl: './conversation-sidebar.component.html',
    styleUrls: ['./conversation-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConversationSidebarComponent implements OnInit {
    public requester: User;
    public otherTickets: Ticket[];
    public previousTicketsVisible = true;
    public envatoPurchase: PurchaseCode;
    private activeTicket: Ticket;

    constructor(
        private modal: Modal,
        private tickets: TicketsService,
        private conversation: Conversation,
        private route: ActivatedRoute,
        private toast: Toast,
    ) { }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.activeTicket = data.ticket;
            this.loadUserData();
        });
    }

    /**
     * Show given ticket in a modal.
     */
    public openTicketModal(ticketId: number) {
        const params = {ticketId: ticketId, activeTicketId: this.conversation.get().id};

        // if tickets were merged, set merged ticket on conversation
        // service and remove merged ticket from sidebar
        this.modal.open(ConversationModalComponent, params, 'conversation-modal-container')
            .afterClosed()
            .subscribe(mergedTicket => {
                if ( ! mergedTicket) return;
                this.otherTickets = this.otherTickets.filter(ticket => ticket.id !== ticketId);
                this.conversation.init(mergedTicket);
            });
    }

    /**
     * Get tickets (except currently active one) of active ticket requester.
     */
    private getUserTicketsExceptCurrent() {
        this.requester = this.activeTicket.user;

        if ( ! this.requester) return;

        this.tickets.getTickets({user_id: this.requester.id, per_page: 6}).subscribe(response => {
            this.otherTickets = response.pagination.data.filter(ticket => {
                // skip currently open ticket
                return ticket.id !== this.activeTicket.id;
            });
        });
    }

    public setEnvatoPurchase() {
        const category = this.conversation.getCategory();
        if ( ! this.requester.purchase_codes.length || ! category) return;
        const categoryName = category.name.toLowerCase();
        const bestMatch = this.requester.purchase_codes.find(code => {
            return code.item_name.toLowerCase().indexOf(categoryName) > -1;
        });
        this.envatoPurchase = bestMatch || this.requester.purchase_codes[0];
    }

    public changeCustomer() {
        this.modal.open(FindUsersModalComponent).beforeClosed()
            .subscribe(user => {
                if ( ! user) return;
                this.tickets.update(this.activeTicket.id, {user_id: user.id})
                    .subscribe(() => {
                        this.requester = user;
                        this.loadUserData();
                        this.toast.open('Customer changed.');
                    });
            });
    }

    private loadUserData() {
        this.getUserTicketsExceptCurrent();
        this.setEnvatoPurchase();
    }
}
