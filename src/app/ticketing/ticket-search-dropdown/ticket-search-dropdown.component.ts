import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {TicketsService} from '../tickets.service';
import {Ticket} from '../../shared/models/Ticket';
import {User} from '../../shared/models/User';
import {AgentSearchModalComponent} from '../agent-search-modal/agent-search-modal.component';
import {of} from 'rxjs';

const EMPTY_RESPONSE = {
    data: {
        tickets: {},
        users: {},
        articles: {},
    }
};

@Component({
    selector: 'ticket-search-dropdown',
    templateUrl: './ticket-search-dropdown.component.html',
    styleUrls: ['./ticket-search-dropdown.component.scss'],
    providers: [TicketsService],
    encapsulation: ViewEncapsulation.None,
})
export class TicketSearchDropdownComponent implements OnInit {
    /**
     * FormControl bound to search input.
     */
    public searchQuery = new FormControl();

    /**
     * Controls for which category results are currently shown.
     */
    public activeCategory = 'tickets';

    /**
     * Whether any results were found on last search.
     */
    public hasResults = false;

    /**
     * Whether at least one search call to backend was made already.
     */
    public loadedResultsAtLeastOnce = false;

    /**
     * Whether results are currently being loaded from backend.
     */
    public isLoading = false;

    /**
     * Search results.
     */
    public results: {tickets?: {data: Ticket[]}, users?: {data: User[]}} = {tickets: {data: []}, users: {data: []}};

    constructor(
        private tickets: TicketsService,
        private router: Router,
        private modal: Modal
    ) {}

    ngOnInit() {
        this.bindToQueryChangeEvent();
    }

    /**
     * Set specified category as active one.
     */
    public setActiveCategory(name: string) {
        this.activeCategory = name;
    }

    /**
     * Open specified ticket route.
     */
    public navigateToTicket(id: number) {
        this.reset();
        this.router.navigate(['/mailbox/tickets', 'tag', 1, 'ticket', id]);
    }

    /**
     * Open specified user route.
     */
    public navigateToUser(id: number) {
        this.reset();
        this.router.navigate(['/mailbox/users', id]);
    }

    /**
     * Open search modal with current search query.
     */
    public openSearchModal() {
        if ( ! this.searchQuery.value) return;
        const searchQuery = this.searchQuery.value;
        this.reset();
        this.modal.open(
            AgentSearchModalComponent,
            {query: searchQuery},
            {panelClass: 'agent-search-modal-container'}
        );
    }

    /**
     * Search for tickets and users matching specified query.
     */
    private search(query: string = null) {
        if ( ! query) return of(EMPTY_RESPONSE);
        this.isLoading = true;
        return this.tickets.search(query).pipe(tap(results => {
            this.hasResults = !!(results.data.tickets.total || results.data.users.total);
            this.loadedResultsAtLeastOnce = true;
            this.results = results.data;
            this.isLoading = false;

            // switch to category that has any results
            if ( ! results.data.tickets.total) {
                this.setActiveCategory('users');
            } else {
                this.setActiveCategory('tickets');
            }
        }));
    }

    /**
     * Reset component to initial state.
     */
    private reset() {
        this.searchQuery.setValue(null);
        this.hasResults = false;
        this.results = null;
        this.activeCategory = 'tickets';
        this.loadedResultsAtLeastOnce = false;
    }

    /**
     * Bind to search form control and search when user types into input.
     */
    private bindToQueryChangeEvent() {
        this.searchQuery.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                switchMap(query => this.search(query)),
                catchError(() => of(EMPTY_RESPONSE)),
            ).subscribe();
    }
}
