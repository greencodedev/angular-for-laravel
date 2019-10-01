import {Component, OnInit, ViewChild} from '@angular/core';
import {TagService} from '../../shared/tag.service';
import {CrupdateTagModalComponent} from './crupdate-tag-modal/crupdate-tag-modal.component';
import {Tag} from '../../shared/models/Tag';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {MatSort} from '@angular/material';

@Component({
    selector: 'tags',
    templateUrl: './tags.component.html',
    providers: [Paginator]
})
export class TagsComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Tag>;

    constructor(
        private tags: TagService,
        public paginator: Paginator<Tag>,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) { }

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Tag>({
            uri: 'tags',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    public deleteSelectedTags() {
        this.tags.deleteMultiple(this.dataSource.getSelectedItems()).subscribe(() => {
            this.dataSource.reset();
        });
    }

    public maybeDeleteSelectedTags() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tags',
            body:  'Are you sure you want to delete selected tags?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedTags();
        });
    }

    public showCrupdateTagModal(tag?: Tag) {
        this.modal.show(CrupdateTagModalComponent, {tag})
            .afterClosed().subscribe(newTag => {
                if ( ! newTag) return;
                this.dataSource.reset();
            });
    }
}
