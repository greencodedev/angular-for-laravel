import {Component, ViewEncapsulation} from '@angular/core';
import {TicketAttachmentsService} from '../../ticketing/ticket-attachments.service';
import {ActivatedRoute} from '@angular/router';
import {Conversation} from '../../conversation/conversation.service';
import {UploadsApiService} from '../../../common/uploads/uploads-api.service';
import {CurrentUser} from '../../../common/auth/current-user';

@Component({
    selector: 'customer-conversation',
    templateUrl: './customer-conversation.component.html',
    styleUrls: ['./customer-conversation.component.scss'],
    providers: [TicketAttachmentsService],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerConversationComponent {

    /**
     * CustomerConversationComponent Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        public uploads: UploadsApiService,
        public currentUser: CurrentUser,
        public conversation: Conversation,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.conversation.init(data.ticket);
        });
    }
}
