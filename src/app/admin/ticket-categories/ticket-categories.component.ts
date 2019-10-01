import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {Tag} from '../../shared/models/Tag';
import {TagService} from '../../shared/tag.service';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {CrupdateTicketCategoryModalComponent} from './crupdate-ticket-category-modal/crupdate-ticket-category-modal.component';

@Component({
    selector: 'ticket-categories',
    templateUrl: './ticket-categories.component.html',
    styleUrls: ['./ticket-categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [Paginator],
})
export class TicketCategoriesComponent implements OnInit {
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
            matSort: this.matSort,
            staticParams: {
                type: 'category',
                with: ['categories'],
                withCount: ['categories']
            }
        });
    }

    public deleteSelectedCategories() {
        this.tags.deleteMultiple(this.dataSource.getSelectedItems()).subscribe(() => {
            this.dataSource.reset();
        });
    }

    public maybeDeleteSelectedCategories() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Categories',
            body:  'Are you sure you want to delete selected categories?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedCategories();
        });
    }

    public showCrupdateCategoryModal(tag?: Tag) {
        this.modal.show(CrupdateTicketCategoryModalComponent, {tag})
            .afterClosed().subscribe(newTag => {
            if ( ! newTag) return;
            this.dataSource.reset();
        });
    }
}
