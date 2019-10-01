import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnChanges, Input} from '@angular/core';
import {HcUrls} from '../../shared/hc-urls.service';
import {Article} from '../../../shared/models/Article';
import {Category} from '../../../shared/models/Category';
import {ActivatedRoute} from '@angular/router';
import {Translations} from '../../../../common/core/translations/translations.service';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadCrumbsComponent implements OnChanges {
    @Input() resource: Article|Category|string;
    @Input() resourceType: 'article'|'category';
    public items: Object[];

    constructor(
        private urls: HcUrls,
        private route: ActivatedRoute,
        private i18n: Translations,
    ) {}

    ngOnChanges() {
        const sub = this.route.params.subscribe(() => {
            this.update();
            sub && sub.unsubscribe();
        });
    }

    private update() {
        this.reset();
        if ( ! this.resource) return;

        if (this.resourceType === 'article') {
            this.generateArticleBreadCrumb();
        } else if (this.resourceType === 'category') {
            this.generateCategoryBreadCrumb();
        } else if (this.resourceType === 'static') {
            this.items.push({name: this.resource});
        }
    }

    private generateArticleBreadCrumb() {
        const article = this.resource as Article;

        // article has no categories
        if ( ! article.categories || ! article.categories.length) return;

        if (article.categories[0]) {
            if (article.categories[0].parent) {
                this.addCategoryItem(article.categories[0].parent);
            }
            this.addCategoryItem(article.categories[0]);
        }

        this.items.push({name: this.i18n.t('Article'), link: this.urls.article(article)});
    }

    private generateCategoryBreadCrumb() {
        const category = this.resource as Category;

        if (category.parent) this.addCategoryItem(category.parent);

        this.addCategoryItem(category);
    }

    private addCategoryItem(category: Category) {
        if ( ! category) return;
        this.items.push({name: category.name, link: this.urls.category(category)});
    }

    private reset() {
        this.items = [{name: this.i18n.t('Help Center'), link: '/help-center'}];
    }
}
