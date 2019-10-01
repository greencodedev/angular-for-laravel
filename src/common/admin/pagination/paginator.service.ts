import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subscription, BehaviorSubject} from 'rxjs';
import {filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';
import {PaginationResponse} from '../../core/types/pagination-response';
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginatedBackendResponse} from '../../core/types/paginated-backend-response';

export const DEFAULT_PAGINATOR_PARAMS = {
    order_by: 'updated_at',
    order_dir: <'asc'|'desc'>'desc',
    page: 1,
    per_page: 15,
};

@Injectable({
    providedIn: 'root',
})
export class Paginator<T> {
    protected params$ = new BehaviorSubject(DEFAULT_PAGINATOR_PARAMS);
    private backendUri: string;
    private lastResponse$ = new BehaviorSubject<PaginationResponse<T>>(null);
    private subscription: Subscription;
    private initiated = false;

    public loading$ = new BehaviorSubject(false);

    public get pagination$(): Observable<PaginationResponse<T>> {
        return this.lastResponse$.asObservable().pipe(filter(p => !!p));
    }

    public get noResults$() {
        // only return TRUE if data has already been
        // loaded from backend and there were not results
        return this.pagination$.pipe(map(p => p.data.length === 0));
    }

    constructor(
        private router: Router,
        private http: AppHttpClient,
    ) {}

    public paginate(userParams: object = {}, url?: string): Observable<PaginationResponse<T>> {
        const queryParams = this.router.routerState.root.snapshot.queryParams;
        this.params$.next({...DEFAULT_PAGINATOR_PARAMS, ...queryParams, ...userParams});

        if ( ! this.initiated) {
            this.init(url);
        }

        // prevent multiple subscriptions
        return this.pagination$.pipe(take(1));
    }

    private init(uri: string) {
        this.backendUri = uri;
        this.subscription = this.params$.pipe(
            switchMap(params => {
                this.loading$.next(true);
                return this.http.get(this.backendUri, params)
                    .pipe(
                        tap(() => this.updateQueryParams(params)),
                        finalize(() => this.loading$.next(false))
                    ) as PaginatedBackendResponse<T>;
            })
        ).subscribe(response => {
            this.lastResponse$.next(response.pagination);
        });

        this.initiated = true;
    }

    /**
     * Update query params of currently active url.
     */
    private updateQueryParams(params = {}) {
        const defaults = DEFAULT_PAGINATOR_PARAMS;
        // there's no need to reflect default
        // or non-common params in query, filter them out
        const filtered = Object.keys(params)
            .filter(key => defaults[key] && params[key] !== defaults[key])
            .reduce((obj, key) => {
                obj[key] = params[key];
                return obj;
            }, {});

        this.router.navigate([], {queryParams: filtered, replaceUrl: true});
    }

    public destroy() {
        this.subscription && this.subscription.unsubscribe();
    }
}
