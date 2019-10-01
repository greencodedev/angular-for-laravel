import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {HelpCenterService} from '../help-center.service';
import {Article} from '../../../shared/models/Article';
import {ArticleParams} from '../../front/help-center.routing';

@Injectable()
export class ArticleResolve implements Resolve<Article> {

    constructor(private helpCenter: HelpCenterService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Promise<Article> {
        const params = route.params as ArticleParams;
        return this.helpCenter.getArticle(+params.articleId, {categories: params.parentId}).toPromise().then(response => {
            return response.article;
        }, () => {
            this.router.navigate(['/help-center']);
            return false;
        }) as any;
    }
}
