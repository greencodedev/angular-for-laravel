import {Component, OnDestroy, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {ArticlesListFiltersComponent} from './articles-list-filters/articles-list-filters.component';
import {ArticlesOrderSelectComponent} from '../../shared/articles-order-select/articles-order-select.component';
import {HelpCenterService} from '../../shared/help-center.service';
import {Article} from '../../../shared/models/Article';
import {Paginator} from '../../../../common/admin/pagination/paginator.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {PageEvent} from '@angular/material';
import {ViewportScroller} from '@angular/common';

@Component({
    selector: 'articles-list',
    templateUrl: './articles-list.component.html',
    styleUrls: ['./articles-list.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class ArticlesListComponent implements AfterViewInit, OnDestroy {
    @ViewChild(ArticlesOrderSelectComponent) articlesOrder: ArticlesOrderSelectComponent;
    @ViewChild(ArticlesListFiltersComponent) articlesListFilters: ArticlesListFiltersComponent;
    @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;

    public searchQuery = new FormControl();
    public selectedLayout = 'grid';

    constructor(
        private helpCenter: HelpCenterService,
        private router: Router,
        public paginator: Paginator<Article>,
        private modal: Modal,
        private scroller: ViewportScroller,
    ) {}

    ngAfterViewInit() {
        this.searchQuery.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(() => this.reloadArticles());
    }

    public goToUpdateArticle(articleId: number) {
        this.router.navigate(['/help-center/manage/', 'articles', articleId, 'edit']);
    }

    public maybeDeleteArticle(article: Article) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Article',
            body:  'Are you sure you want to delete this article?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.helpCenter.deleteArticles([article.id]).subscribe(() => this.paginator.paginate());
        });
    }

    public setLayout(name: string) {
        this.selectedLayout = name;
    }

    public isLayoutActive(name: string) {
        return this.selectedLayout === name;
    }

    public reloadArticles(pagination: {page?: number, perPage?: number} = {}) {
        const params = {...this.getQueryParams(), ...pagination};
        this.paginator.paginate(params, 'help-center/articles')
            .subscribe(() => {
                if (this.scrollContainer) {
                    this.scrollContainer.nativeElement.scrollTop = 0;
                }
            });
    }

    public matPaginatorPageChanged(e: PageEvent) {
        // material paginator is zero based, laravel is one based, need to sync page number here
        const page = e.pageIndex ? e.pageIndex + 1 : undefined;
        this.reloadArticles({page, perPage: e.pageSize});
    }

    private getQueryParams() {
        const filters = this.articlesListFilters.getFilters(),
            merged  = {} as {[key: string]: string|number};

        // only specify filters with 'thruthy' or 0 value
        for (const name in filters) {
            if (filters[name] || filters[name] === 0) {
                merged[name] = filters[name];
            }
        }

        if (this.searchQuery.value) {
            merged.query = this.searchQuery.value;
        }

        merged.orderBy = this.articlesOrder.selectedValue;

        return merged;
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }
}
