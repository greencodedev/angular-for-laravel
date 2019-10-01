import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CannedRepliesService} from '../../ticketing/canned-replies/canned-replies.service';
import {CannedReply} from '../../shared/models/CannedReply';
import {CrupdateCannedReplyModalComponent} from '../../ticketing/canned-replies/crupdate-canned-reply-modal/crupdate-canned-reply-modal.component';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {MatSort} from '@angular/material';

@Component({
    selector: 'canned-replies',
    templateUrl: './canned-replies.component.html',
    styleUrls: ['./canned-replies.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class CannedRepliesComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<CannedReply>;

    constructor(
        public paginator: Paginator<CannedReply>,
        private replies: CannedRepliesService,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<CannedReply>({
            uri: 'canned-replies',
            staticParams: {with: 'user'},
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    public showCrupdateCannedReplyModal(cannedReply?: CannedReply) {
        this.modal.open(
            CrupdateCannedReplyModalComponent,
            {cannedReply},
            {panelClass: 'crupdate-canned-reply-modal-container'},
        ).afterClosed().subscribe(newCannedReply => {
            if ( ! newCannedReply) return;
            this.dataSource.reset();
        });
    }

    public maybeDeleteCannedReplies() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Canned Replies',
            body:  'Are you sure you want to delete selected replies?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedCannedReplies();
        });
    }

    public deleteSelectedCannedReplies() {
        this.replies.delete(this.dataSource.getSelectedItems()).subscribe(() => {
            this.dataSource.reset();
        });
    }
}
