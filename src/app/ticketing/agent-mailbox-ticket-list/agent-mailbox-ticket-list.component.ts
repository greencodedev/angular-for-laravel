import {Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MailboxTagsService} from '../mailbox-tags.service';
import {Ticket} from '../../shared/models/Ticket';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {BackendEvents} from '../../shared/backend-events';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {MatPaginator} from '@angular/material';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';

@Component({
    selector: 'agent-mailbox-ticket-list',
    templateUrl: './agent-mailbox-ticket-list.component.html',
    styleUrls: ['./agent-mailbox-ticket-list.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class AgentMailboxTicketListComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) matPaginator: MatPaginator;
    public dataSource: PaginatedDataTableSource<Ticket>;

    constructor(
        private mailboxTags: MailboxTagsService,
        private router: Router,
        private modal: Modal,
        private route: ActivatedRoute,
        private backendEvents: BackendEvents,
        private paginator: Paginator<Ticket>,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Ticket>({
            uri: 'tickets',
            dataPaginator: this.paginator,
            matPaginator: this.matPaginator,
        });

        this.route.params.subscribe(() => {
            const params = {tag_id: this.getActiveTagId()};
            this.dataSource.reset(params);
        });

        this.bindToBackendEvents();
    }

    ngOnDestroy() {
        this.dataSource.disconnect();
    }

    public refreshTicketsList() {
        this.dataSource.reset();
    }

    private bindToBackendEvents() {
        this.backendEvents.ticketCreated.subscribe((newTicket: Ticket) => {
            // if new ticket does not have currently active status, bail
            if ( ! newTicket.tags || ! newTicket.tags.find(tag => tag.id === this.mailboxTags.getActiveTagId())) return;

            // if ticket is already in tickets list, bail
            const data = this.dataSource.getData();
            if (data.find((ticket) => ticket.id === newTicket.id)) return;

            // add new ticket to tickets list and refresh mailbox tags
            newTicket['animated'] = true;
            this.dataSource.setData([newTicket, ...data]);
            this.mailboxTags.refresh();
        });
    }

    private getActiveTagId() {
        const openTag = this.mailboxTags.getTagByIdOrName('open'),
            tagId = this.route.snapshot.params.tag_id;

        return tagId ? tagId : openTag.id;
    }
}
