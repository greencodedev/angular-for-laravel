import {Component, ViewEncapsulation, Input} from '@angular/core';
import {Category} from '../../../../shared/models/Category';
import {HcUrls} from '../../../shared/hc-urls.service';
import {Settings} from '../../../../../common/core/config/settings.service';

@Component({
    selector: 'article-grid',
    templateUrl: './article-grid.component.html',
    styleUrls: ['./article-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleGridComponent {
    @Input() categories: Category[] = [];

    constructor(
        public urls: HcUrls,
        public settings: Settings,
    ) {}

    /**
     * Check if specified category should be shown on hc homepage.
     */
    public shouldHideCategory(category: Category): boolean {
        if (category.hidden || ! category.articles) return true;

        return this.settings.get('hc_home.hide_small_categories') &&
            category.articles.length < 2;
    }
}
