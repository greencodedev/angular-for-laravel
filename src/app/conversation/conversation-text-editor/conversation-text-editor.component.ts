import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Conversation} from '../conversation.service';
import {MailboxTagsService} from '../../ticketing/mailbox-tags.service';
import {Tag} from '../../shared/models/Tag';
import {ConfirmReplyDeleteModalComponent} from '../confirm-reply-delete-modal/confirm-reply-delete-modal.component';
import {TextEditorComponent} from '../../../common/text-editor/text-editor.component';
import {Subscription} from 'rxjs';
import {CurrentUser} from '../../../common/auth/current-user';
import {BrowserEvents} from '../../../common/core/services/browser-events.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CannedReply} from '../../shared/models/CannedReply';
import {DraftPayload} from '../../ticketing/tickets.service';
import {Article} from '../../shared/models/Article';
import {HcUrls} from '../../help-center/shared/hc-urls.service';
import {Settings} from '../../../common/core/config/settings.service';
import {SuggestedArticlesDropdownComponent} from '../../help-center/suggested-articles-dropdown/suggested-articles-dropdown.component';

@Component({
    selector: 'conversation-text-editor',
    templateUrl: './conversation-text-editor.component.html',
    styleUrls: ['./conversation-text-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConversationTextEditorComponent implements OnInit, OnDestroy {
    @ViewChild('textEditor') textEditor: TextEditorComponent;
    @ViewChild(SuggestedArticlesDropdownComponent) articleDropdown: SuggestedArticlesDropdownComponent;

    /**
     * Status that should be applied to ticket after submitting reply.
     */
    public selectedStatus = new Tag();

    private subscriptions: Subscription[] = [];

    constructor(
        private modal: Modal,
        public currentUser: CurrentUser,
        public conversation: Conversation,
        private browserEvents: BrowserEvents,
        public mailboxTags: MailboxTagsService,
        private hcUrls: HcUrls,
        private settings: Settings,
    ) {}

    ngOnInit() {
        this.setSelectedStatus();
        this.initKeybinds();
        this.conversation.setEditor(this.textEditor);
    }

    public submitReply() {
        const payload = {body: this.textEditor.getContents(), status: this.selectedStatus};
        this.conversation.submitReply(payload).subscribe(() => {
            this.closeEditor();
        }, () => {});
    }

    public saveDraft(params: DraftPayload = {}) {
        return this.conversation.draft.save(params);
    }

    public closeEditor() {
        this.conversation.closeEditor();
        this.conversation.draft.reset();
        this.textEditor.reset();
    }

    public saveDraftAndAddToReplies() {
        if ( ! this.conversation.draft.isEmpty()) {
            this.saveDraft().subscribe(response => {
                this.conversation.replies.add(response.data);
                this.closeEditor();
            });
        } else {
            this.closeEditor();
        }
    }

    public maybeDeleteDraft() {
        // TODO: refactor to use async/wait and remove duplicated stuff
        const draft = this.conversation.draft.get();

        if (draft.id) {
            this.modal.show(ConfirmReplyDeleteModalComponent, {reply: draft}).afterClosed()
                .subscribe(confirmed => {
                    if ( ! confirmed) return;
                    this.conversation.draft.delete();
                    this.closeEditor();
                });
        } else {
            this.closeEditor();
        }
    }

    /**
     * Add specified canned reply to text editor.
     */
    public applyCannedReply(reply: CannedReply) {
        this.textEditor.insertContents(reply.body);
        setTimeout(() => {
            this.saveDraft({uploads: reply.uploads.map(upload => upload.id)});
        });
    }

    /**
     * Set the status that should be applied to ticket after submitting reply.
     */
    private setSelectedStatus() {
        let tag: Tag;

        // if current user is customer open ticket when they reply,
        // otherwise set default tag to "closed"
        if ( ! this.currentUser.hasPermission('tickets.update')) {
            tag = this.mailboxTags.getTagByIdOrName('open');
        } else {
            tag = this.mailboxTags.getTagByIdOrName('closed');
        }

        this.selectedStatus = tag;
    }

    /**
     * Init keybinds for conversation text editor.
     */
    private initKeybinds() {
        const sub = this.browserEvents.globalKeyDown$.subscribe(e => {

            // if any modals are open or user is currently typing, bail
            if (this.modal.anyDialogOpen() || BrowserEvents.userIsTyping()) return;

            // open text editor
            if (e.keyCode === this.browserEvents.keyCodes.letters.r) {
                this.conversation.openEditor();
            }

            if (e.keyCode === this.browserEvents.keyCodes.forwardSlash && e.ctrlKey) {
                this.articleDropdown.focus();
            }
        });

        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.saveDraft();
        this.closeEditor();

        this.subscriptions.forEach(subscription => {
            subscription && subscription.unsubscribe();
        });
    }

    public insertArticleLink(article: Article) {
        const uri = this.hcUrls.article(article).join('/');
        this.textEditor.insertLink({
            target: 'blank',
            href: this.settings.getBaseUrl() + uri,
            text: article.title
        });
    }
}
