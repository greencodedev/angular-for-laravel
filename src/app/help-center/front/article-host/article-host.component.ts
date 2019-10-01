import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Article} from '../../../shared/models/Article';
import {HcUrls} from '../../shared/hc-urls.service';
import {Settings} from '../../../../common/core/config/settings.service';
import {BehaviorSubject} from 'rxjs';
import {BreakpointsService} from '../../../../common/core/ui/breakpoints.service';

@Component({
    selector: 'article-host',
    templateUrl: './article-host.component.html',
    styleUrls: ['./article-host.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArticleHostComponent implements OnInit {
    public article: Article;
    public sidenavVisible$ = new BehaviorSubject<boolean>(true);

    constructor(
        private route: ActivatedRoute,
        public urls: HcUrls,
        public settings: Settings,
        public breakpoints: BreakpointsService,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.article = data.article;
            // always close sidenav when changing articles
            this.sidenavVisible$.next(false);
        });

        this.sidenavVisible$.next(
            !this.breakpoints.isTablet$.value && !this.breakpoints.isMobile$
        );
    }

    public toggleSidenav() {
        this.sidenavVisible$.next(!this.sidenavVisible$.value);
    }
}
