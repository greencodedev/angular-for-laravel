import {Component, ViewEncapsulation, Input, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Conversation} from '../conversation.service';
import {Tag} from '../../shared/models/Tag';
import {Reply} from '../../shared/models/Reply';
import {TicketsService} from '../../ticketing/tickets.service';
import {MailboxTagsService} from '../../ticketing/mailbox-tags.service';
import {AddNoteModalComponent} from '../../ticketing/add-note-modal/add-note-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AssignTicketDropdownComponent} from '../../ticketing/assign-ticket-dropdown/assign-ticket-dropdown.component';
import {AddTagDropdownComponent} from '../../ticketing/add-tag-dropdown/add-tag-dropdown.component';
import {CurrentUser} from '../../../common/auth/current-user';
import {BrowserEvents} from '../../../common/core/services/browser-events.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {MatMenuTrigger} from '@angular/material';
import {RouterHistory} from '../../shared/router-history.service';

@Component({
    selector: 'conversation-toolbar',
    templateUrl: './conversation-toolbar.component.html',
    styleUrls: ['./conversation-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConversationToolbarComponent implements OnInit, OnDestroy {
    @ViewChild(AssignTicketDropdownComponent) assignTicketDropdown: AssignTicketDropdownComponent;
    @ViewChild(AddTagDropdownComponent) addTagDropdown: AddTagDropdownComponent;
    @ViewChild('ticketStatusMenuTrigger', {read: MatMenuTrigger}) ticketStatusTrigger: MatMenuTrigger;

    @Input() hideBackButton = false;

    private subscriptions = [];

    constructor(
        private router: Router,
        public injector: Injector,
        private modals: Modal,
        private route: ActivatedRoute,
        public currentUser: CurrentUser,
        private tickets: TicketsService,
        public conversation: Conversation,
        private browserEvents: BrowserEvents,
        public mailboxTags: MailboxTagsService,
        private routerHistory: RouterHistory,
    ) {}

    ngOnInit() {
        this.initKeybinds();
    }

    public changeTicketStatus(status: Tag) {
        if ( ! status) return;

        this.tickets.changeTicketStatus(this.conversation.get().id, status.name).subscribe(() => {
            this.conversation.performAfterReplyAction();
            this.conversation.setStatus(status);
        });
    }

    public showNoteModal() {
        this.modals.open(
            AddNoteModalComponent,
            {ticketId: this.conversation.get().id},
            {panelClass: 'add-note-modal-container'}
        ).afterClosed().subscribe(note => {
            if ( ! note) return;
            this.addNewNote(note);
        });
    }

    public addTag(tag: Tag) {
        this.conversation.addTag(tag);
        this.refreshMailboxTags();
    }

    public addNewNote(note: Reply) {
        if ( ! note) return;
        this.conversation.replies.add(note);
    }

    public navigateToTicketsList() {
        if (this.routerHistory.getPrevious()) {
            this.routerHistory.back();
        } else {
            this.router.navigate(['../../'], {relativeTo: this.route});
        }
    }

    public refreshMailboxTags() {
        this.mailboxTags.refresh();
    }

    private initKeybinds() {
        const sub = this.browserEvents.globalKeyDown$.subscribe(e => {
            let handled = true;

            // if any modals are open or user is currently typing, bail
            if (this.modals.anyDialogOpen() || BrowserEvents.userIsTyping() || e.ctrlKey) return;

            switch (e.keyCode) {
                // main toolbar actions
                case this.browserEvents.keyCodes.letters.b:
                    this.closeAllMenus();
                    this.navigateToTicketsList();
                    break;
                case this.browserEvents.keyCodes.letters.a:
                    this.assignTicketDropdown.open();
                    break;
                case this.browserEvents.keyCodes.letters.n:
                    this.closeAllMenus();
                    this.showNoteModal();
                    break;
                case this.browserEvents.keyCodes.letters.t:
                    this.addTagDropdown.open();
                    break;
                case this.browserEvents.keyCodes.letters.s:
                    if (this.ticketStatusTrigger.menuOpen) {
                        this.handleTicketStatusChangeKeybind('spam');
                    } else {
                        this.ticketStatusTrigger.openMenu();
                    }
                    break;

                // change ticket status
                case this.browserEvents.keyCodes.letters.o:
                    this.handleTicketStatusChangeKeybind('open');
                    break;
                case this.browserEvents.keyCodes.letters.c:
                    this.handleTicketStatusChangeKeybind('closed');
                    break;
                case this.browserEvents.keyCodes.letters.p:
                    this.handleTicketStatusChangeKeybind('pending');
                    break;
                default:
                    handled = false;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        this.subscriptions.push(sub);
    }

    private closeAllMenus() {
        this.addTagDropdown.close();
        this.assignTicketDropdown.close();
        this.ticketStatusTrigger.closeMenu();
    }

    /**
     * Change ticket status so specified one and close dropdown.
     */
    private handleTicketStatusChangeKeybind(status: string) {
        if ( ! this.ticketStatusTrigger.menuOpen) return;
        this.changeTicketStatus(this.mailboxTags.getTagByIdOrName(status));
        this.ticketStatusTrigger.closeMenu();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (subscription) subscription.unsubscribe();
        });
    }
}
