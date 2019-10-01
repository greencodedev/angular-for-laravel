import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {CrupdatePlanModalComponent} from '../crupdate-plan-modal/crupdate-plan-modal.component';
import {finalize} from 'rxjs/operators';
import {Toast} from '../../../../core/ui/toast.service';
import {Paginator} from '../../../pagination/paginator.service';
import {Modal} from '../../../../core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../../../core/ui/confirm-modal/confirm-modal.component';
import {PaginatedDataTableSource} from '../../../data-table/data/paginated-data-table-source';
import { CurrentUser } from '../../../../auth/current-user';
import { Plans } from '../../../../shared/billing/plans.service';
import { Plan } from '../../../../shared/billing/models/plan';

@Component({
    selector: 'plans-list',
    templateUrl: './plans-list.component.html',
    styleUrls: ['./plans-list.component.scss'],
    providers: [Paginator, Plans],
    encapsulation: ViewEncapsulation.None
})
export class PlansListComponent implements OnInit {
    @ViewChild(MatPaginator) matPaginator: MatPaginator;
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Plan>;
    public loading = false;

    constructor(
        public paginator: Paginator<Plan>,
        private plans: Plans,
        private modal: Modal,
        public currentUser: CurrentUser,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Plan>({
            uri: 'billing/plans',
            dataPaginator: this.paginator,
            matPaginator: this.matPaginator,
            matSort: this.matSort
        });
    }

    /**
     * Ask user to confirm deletion of selected plans
     * and delete selected plans if user confirms.
     */
    public maybeDeleteSelectedPlans() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Plans',
            body:  'Are you sure you want to delete selected plans?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPlans();
        });
    }

    /**
     * Delete currently selected plans.
     */
    public deleteSelectedPlans() {
        this.loading = true;

        const ids = this.dataSource.selectedRows.selected.map(plan => plan.id);

        this.plans.delete({ids})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.dataSource.reset();
            });
    }

    /**
     * Show modal for editing plan if plan is specified
     * or for creating a new plan otherwise.
     */
    public showCrupdatePlanModal(plan?: Plan) {
        this.modal.open(
            CrupdatePlanModalComponent,
            {plan, plans: this.dataSource.getData()},
            'crupdate-plan-modal-container',
        )
        .afterClosed()
        .subscribe(data => {
            if ( ! data) return;
            this.dataSource.reset();
        });
    }

    public syncPlans() {
        this.loading = true;

        this.plans.sync().subscribe(() => {
            this.loading = false;
            this.toast.open('Synced plans across all enabled payment gateways');
        }, () => this.loading = false);
    }
}
