import {Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild} from '@angular/core';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {Ticket} from '../../shared/models/Ticket';
import {MatPaginator, MatSort} from '@angular/material';
import {Tag} from '../../shared/models/Tag';
import {Router} from '@angular/router';

@Component({
    selector: 'customer-tickets-list',
    templateUrl: './customer-tickets-list.component.html',
    styleUrls: ['./customer-tickets-list.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerTicketsListComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) matPaginator: MatPaginator;
    public dataSource: PaginatedDataTableSource<Ticket>;

    constructor(
        public paginator: Paginator<Ticket>,
        public currentUser: CurrentUser,
        private router: Router,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Ticket>({
            uri: 'users/' + this.currentUser.get('id') + '/tickets',
            dataPaginator: this.paginator,
            matPaginator: this.matPaginator,
            matSort: this.matSort,
        }).init();
    }

    ngOnDestroy() {
        this.dataSource.disconnect();
    }

    public getStatus(ticket: Ticket): Tag {
        return ticket.tags.filter(tag => tag.type === 'status')[0];
    }

    public ticketIsOpen(ticket: Ticket): boolean {
        const status = this.getStatus(ticket);
        if ( ! status) return false;
        return status.name === 'open' || status.name === 'pending';
    }

    public openConversation(ticket: Ticket) {
        this.router.navigate(['/help-center/tickets', ticket.id]);
    }
}
