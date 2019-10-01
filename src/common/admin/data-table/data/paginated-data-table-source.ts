import {BehaviorSubject, Observable, of, combineLatest, merge} from 'rxjs';
import {debounceTime, map, distinctUntilChanged} from 'rxjs/operators';
import {DataTableSourceConfig} from './data-table-source-config';
import {FormControl} from '@angular/forms';
import {PageEvent, Sort} from '@angular/material';
import {arrayToObject} from '../../../core/utils/array-to-object';
import {DataSource, SelectionModel} from '@angular/cdk/collections';
import {DEFAULT_PAGINATOR_PARAMS} from '../../pagination/paginator.service';

export class PaginatedDataTableSource<T> implements DataSource<T> {
    private initiated = false;
    private data$ = new BehaviorSubject<T[]>([]);
    private userParamsChange$ = new BehaviorSubject<object>({});

    public selectedRows = new SelectionModel<T>(true, []);
    public searchControl = new FormControl();

    public get noResults$() {
        return this.config.dataPaginator.noResults$;
    }

    public get loading$() {
        return this.config.dataPaginator.loading$;
    }

    constructor(public config: DataTableSourceConfig<T>) {}

    public anyRowsSelected() {
        return this.selectedRows.hasValue();
    }

    public allRowsSelected(): boolean {
        return this.selectedRows.selected.length &&
            this.selectedRows.selected.length === this.data$.value.length;
    }

    public toggleAllRows() {
        this.allRowsSelected() ?
            this.deselectAllItems() :
            this.data$.value.forEach(row => this.selectedRows.select(row));
    }

    public deselectAllItems() {
        this.selectedRows.clear();
    }

    public getSelectedItems(): number[] {
        return this.selectedRows.selected.map(item => item['id']);
    }

    public setSelectedItems(items: T[]) {
        this.deselectAllItems();
        this.selectedRows.select(...items);
    }

    public setData(data: T[]) {
        this.config.initialData = data;
        this.data$.next(data);
    }

    public getData() {
        return this.data$.value;
    }

    /**
     * Merge specified params with current
     * pagination params and reload data.
     */
    public reload(params: object) {
        this.userParamsChange$.next(params);
        if ( ! this.initiated) {
            this.init();
        }
    }

    /**
     * Reset current pagination params to initial
     * state and reload data using specified params
     */
    public reset(params?: object) {
        this.searchControl.reset();
        this.resetSort();
        this.resetMatPaginator();
        this.deselectAllItems();
        this.reload(params);
    }

    public init() {
        if (this.initiated) return this;
        const sortChange = this.config.matSort ?
            merge(this.config.matSort.sortChange, this.config.matSort.initialized) :
            of(null);
        const pageChange = this.config.matPaginator ?
            merge(this.config.matPaginator.page, this.config.matPaginator.initialized) :
            of(null);
        const searchChange = this.searchControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            map(query => {
                return {query};
            })
        );

        combineLatest(sortChange, pageChange, searchChange, this.userParamsChange$)
            .pipe(
                // prevent double trigger when resetting all filters at the same time
                debounceTime(0),
                map(params => this.transformParams(params)),
            )
            .subscribe(params => {
                this.config.dataPaginator.paginate(params, this.config.uri);
            });

        this.config.dataPaginator.pagination$.subscribe(pagination => {
            // material paginator current page is zero-based while laravel starts from one
            this.config.matPaginator.pageIndex = pagination.current_page - 1;
            this.config.matPaginator.pageSize = pagination.per_page;
            this.config.matPaginator.length = pagination.data.length ? pagination.total : 0;
            this.data$.next(pagination.data);
        });

        // angular does not fire "valueChanges" on form control if default
        // value is provided, so need to trigger it manually here otherwise
        // changes pipeline will not fire until search control value changes
        // # https://github.com/angular/angular/issues/14542
        this.searchControl.setValue(null);

        this.initiated = true;
        return this;
    }

    private transformParams(originalParams: (PageEvent & Sort)[]) {
        const params = arrayToObject(originalParams);
        params.page = params.pageIndex ? params.pageIndex + 1 : undefined;
        params.per_page = params.pageSize;
        params.order_by = params.active;
        params.order_dir = params.direction;

        // remove "undefined" and renamed values from object
        const keysToRemove = ['pageIndex', 'pageSize', 'active', 'direction'];
        Object.keys(params)
            .forEach(key => {
                if (keysToRemove.indexOf(key) > -1 || params[key] === undefined) {
                    delete params[key];
                }
            });

        // merge static params specified by users, they will
        // not change and should be sent with every request
        return {...this.config.staticParams, ...params};
    }

    private resetSort() {
        if ( ! this.config.matSort) return;
        this.config.matSort.sort({
            id: DEFAULT_PAGINATOR_PARAMS.order_by,
            start: DEFAULT_PAGINATOR_PARAMS.order_dir,
            disableClear: false
        });
    }

    private resetMatPaginator() {
        if ( ! this.config.matPaginator) return;
        this.config.matPaginator.length = 0;
        this.config.matPaginator.pageSize = DEFAULT_PAGINATOR_PARAMS.per_page;
        this.config.matPaginator.firstPage();
    }

    public connect(): Observable<T[]> {
        return this.data$;
    }

    public disconnect() {
        this.config.dataPaginator.destroy();
        this.data$.complete();
    }
}
