import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input, OnChanges, OnInit
} from '@angular/core';
import {Article} from '../../../../shared/models/Article';
import {BehaviorSubject} from 'rxjs';
import {slugifyString} from '../../../../../common/core/utils/slugify-string';
import {ActivatedRoute, Router} from '@angular/router';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'article-content',
    templateUrl: './article-content.component.html',
    styleUrls: ['./article-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContentComponent implements OnChanges, OnInit {
    @Input() article: Article;

    public content$ = new BehaviorSubject<string[]>([]);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.fragment
            .pipe(delay(10))
            .subscribe(fragment => {
                this.scrollContentIntoView(fragment);
            });
    }

    ngOnChanges() {
        const matches = [];
        const regExp = /<h2 id=".*?">(.*?)<\/h2>/g;
        let match = regExp.exec(this.article.body);
        while (match != null) {
            let heading = match[1];
            if (heading.indexOf('<a') === 0) {
                heading = heading.match(/<a href=".*?">(.*?)<\/a>/)[1];
            }
            matches.push(heading);
            match = regExp.exec(this.article.body);
        }
        this.content$.next(matches || []);
    }

    public scrollContentIntoView(contentItem: string) {
        if (contentItem) {
            const el = document.querySelector('article #' + contentItem);
            if (el) {
                el.scrollIntoView(true);
                // fixed navbar height
                window.scrollTo(0, window.scrollY - 64);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }

    public slug(contentItem: string) {
        return slugifyString(contentItem);
    }

    public onContentItemClick(contentItem: string) {
        // if this fragment is already present in url angular fragment change
        // will not trigger, so we need to manually scroll content item into view
        const slug = this.slug(contentItem);
        if (this.route.snapshot.fragment === slug) {
            this.scrollContentIntoView(slug);
        }
    }
}
