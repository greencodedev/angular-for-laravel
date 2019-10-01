import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HcUrls} from '../../shared/hc-urls.service';
import {HelpCenterService} from '../../shared/help-center.service';
import {Category} from '../../../shared/models/Category';
import {Article} from '../../../shared/models/Article';
import {Settings} from '../../../../common/core/config/settings.service';

@Component({
    selector: 'category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss', './category-articles.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class CategoryComponent implements OnInit {
    public category: Category;
    public articles: Article[] = [];

    constructor(
        private route: ActivatedRoute,
        private helpCenter: HelpCenterService,
        public urls: HcUrls,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.category = data['resolves']['category'];
            this.articles = data['resolves']['articles'];
        });
    }

    /**
     * Reload articles in specified order.
     */
    public reloadArticles(order: string) {
        const params = {
            categories: this.route.snapshot.params['categoryId'],
            orderBy: order
        };

        this.helpCenter.getArticles(params).subscribe(response => {
            this.articles = response.pagination.data;
        });
    }
}
