import {Component, Inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {TicketsService} from '../tickets.service';
import {Ticket} from '../../shared/models/Ticket';
import {User} from '../../shared/models/User';
import {FormControl} from '@angular/forms';
import {Article} from '../../shared/models/Article';
import {HcUrls} from '../../help-center/shared/hc-urls.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PaginationResponse} from '../../../common/core/types/pagination-response';
import {TicketsListComponent} from '../../shared/tickets-list/tickets-list.component';

interface AgentSearchModalData {
    query: string;
}

@Component({
    selector: 'agent-search-modal',
    templateUrl: './agent-search-modal.component.html',
    styleUrls: ['./agent-search-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AgentSearchModalComponent {
    @ViewChild(TicketsListComponent) ticketsList: TicketsListComponent;
    public searchQueryControl = new FormControl();

    public results: {
        tickets?: PaginationResponse<Ticket>,
        users?: PaginationResponse<User>,
        articles?: PaginationResponse<Article>
    } = {};

    public isSearching = false;
    public hasResults: boolean|null = null;
    private activeTab = 'tickets';

    constructor(
        private dialogRef: MatDialogRef<AgentSearchModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AgentSearchModalData,
        private tickets: TicketsService,
        public urls: HcUrls,
    ) {
        this.hydrate();
    }

    public close() {
        this.dialogRef.close();
    }

    private hydrate() {
        this.bindToSearchInput();
        this.searchQueryControl.setValue(this.data.query);
    }

    public setActiveTab(name: string) {
        this.activeTab = name;
    }

    public activeTabIs(name: string) {
        return this.activeTab === name;
    }

    private performSearch(query: string) {
        this.isSearching = true;

        this.tickets.search(query, {detailed: true, per_page: 20}).subscribe(results => {
            this.results = results.data;
            this.isSearching = false;
            this.openFirstTabWithResults();
        });
    }

    private openFirstTabWithResults() {
        ['tickets', 'users', 'articles'].some(type => {
            if (this.results[type] && this.results[type]['total']) {
                this.setActiveTab(type);
                return true;
            }
        });
    }

    private bindToSearchInput() {
        this.searchQueryControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(query => {
                return this.performSearch(query);
            });
    }
}
