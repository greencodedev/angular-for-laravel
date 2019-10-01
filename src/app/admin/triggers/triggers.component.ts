import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TriggersService} from './triggers.service';
import {Trigger} from '../../shared/models/Trigger';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {CurrentUser} from '../../../common/auth/current-user';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {MatSort} from '@angular/material';

@Component({
    selector: 'triggers',
    templateUrl: './triggers.component.html',
    styleUrls: ['./triggers.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})

export class TriggerComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Trigger>;

    constructor(
        private paginator: Paginator<Trigger>,
        public currentUser: CurrentUser,
        private modal: Modal,
        private triggers: TriggersService
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Trigger>({
            uri: 'triggers',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    public maybeDeleteSelectedTriggers() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Triggers',
            body:  'Are you sure you want to delete selected triggers?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedTriggers();
        });
    }

    public deleteSelectedTriggers() {
        this.triggers.delete(this.dataSource.getSelectedItems()).subscribe(() => {
            this.dataSource.reset();
        });
    }
}
