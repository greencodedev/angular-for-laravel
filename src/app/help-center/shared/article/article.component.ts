import {AfterViewChecked, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HelpCenterService} from '../help-center.service';
import {Article} from '../../../shared/models/Article';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import {CurrentUser} from '../../../../common/auth/current-user';

@Component({
    selector: 'article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit, AfterViewChecked {

    /**
     * Full article model, if this is passed in
     * there's no need to fetch article by url params.
     */
    @Input() public article: Article;

    /**
     * Trusted article body (includes html) for the view.
     */
    public trustedArticleBody: SafeHtml;

    /**
     * Whether code has already been highlighted.
     * (for article content, and not component).
     */
    public codeHighlighted = false;

    /**
     * ArticleComponent Constructor.
     */
    constructor(
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private helpCenter: HelpCenterService,
        public user: CurrentUser,
    ) {}

    ngOnInit() {
        if (this.article) return this.initArticle(this.article);

        this.route.data.subscribe(data => {
            this.codeHighlighted = false;

            if (data['article']) {
                this.initArticle(data['article']);
            } else {
                this.getArticle(this.route.snapshot.params);
            }
        });
    }

    ngAfterViewChecked() {
        if ( ! this.codeHighlighted && Prism) {
            Prism.highlightAll();
            this.codeHighlighted = true;
        }
    }

    /**
     * Initiate article component.
     */
    private initArticle(article: Article) {
        this.article = article;
        this.trustedArticleBody = this.sanitizer.bypassSecurityTrustHtml(article.body);
    }

    /**
     * Fetch help center article specified in url params.
     */
    private getArticle(urlParams) {
        this.helpCenter.getArticle(urlParams['article']).subscribe(response => {
            this.initArticle(response.article);
        }, () => {
            this.router.navigate(['/help-center']);
        });
    }
}
