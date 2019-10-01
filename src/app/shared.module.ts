import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CustomerFooterComponent} from './shared/customer-footer/customer-footer.component';
import {EmailAddressModalComponent} from './shared/email-address-modal/email-address-modal.component';
import {UiModule} from '../common/core/ui/ui.module';
import {ConversationInfiniteScrollDirective} from './shared/conversation-infinite-scroll.directive';
import {MatChipsModule, MatDialogModule, MatProgressBarModule, MatSortModule, MatTableModule} from '@angular/material';
import {ReplyAttachmentListComponent} from './shared/reply-attachment-list/reply-attachment-list.component';
import {FilePreviewOverlayComponent} from './shared/file-preview-overlay/file-preview-overlay.component';
import {FilePreviewToolbarComponent} from './shared/file-preview-overlay/file-preview-toolbar/file-preview-toolbar.component';
import {FilePreviewModule} from '../common/file-preview/file-preview.module';
import {UploadsModule} from '../common/uploads/uploads.module';
import {TagsManagerComponent} from './shared/tags-manager/tags-manager.component';
import {TicketsListComponent} from './shared/tickets-list/tickets-list.component';
import {HighlightOpenTicketDirective} from './shared/tickets-list/highlight-open-ticket-directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        UiModule,
        FilePreviewModule,
        UploadsModule,

        // material
        MatProgressBarModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatChipsModule,
    ],
    declarations: [
        CustomerFooterComponent,
        EmailAddressModalComponent,
        ConversationInfiniteScrollDirective,
        ReplyAttachmentListComponent,
        FilePreviewOverlayComponent,
        FilePreviewToolbarComponent,
        TagsManagerComponent,
        TicketsListComponent,
        HighlightOpenTicketDirective,
    ],
    entryComponents: [
        EmailAddressModalComponent,
        FilePreviewOverlayComponent,
    ],
    exports: [
        CustomerFooterComponent,
        ConversationInfiniteScrollDirective,
        ReplyAttachmentListComponent,
        TagsManagerComponent,
        TicketsListComponent,
        HighlightOpenTicketDirective,
        UploadsModule,
    ],
})
export class SharedModule { }
