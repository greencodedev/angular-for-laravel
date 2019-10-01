import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {HelpCenterService} from '../../shared/help-center.service';
import {Category} from '../../../shared/models/Category';
import {Article} from '../../../shared/models/Article';
import {CategoriesService} from '../../shared/categories.service';
import {Settings} from '../../../../common/core/config/settings.service';
import {EMPTY, forkJoin, Observable, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable()
export class CategoryResolve implements Resolve<{category: Category, articles: Article[]}> {
    constructor(
        private helpCenter: HelpCenterService,
        private categories: CategoriesService,
        private router: Router,
        private settings: Settings
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{category: Category, articles: Article[]}> {
        const params = {
            categories: route.params['categoryId'],
            orderBy: this.settings.get('articles.default_order'),
            limit: 10,
        };

        return forkJoin(
            this.categories.getCategory(route.params['categoryId']),
            this.helpCenter.getArticles(params),
        ).pipe(
            catchError(() => {
                this.router.navigate(['/help-center']);
                return EMPTY;
            }),
            mergeMap(response => {
                return of({category: response[0].category, articles: response[1].pagination.data});
            })
        );
    }
}
