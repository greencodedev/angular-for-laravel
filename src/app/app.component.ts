import {Component, ElementRef, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {BackendEvents} from './shared/backend-events';
import {NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {BrowserEvents} from '../common/core/services/browser-events.service';
import {Settings} from '../common/core/config/settings.service';
import {AppHttpClient} from '../common/core/http/app-http-client.service';
import {filter} from 'rxjs/operators';
import {CustomHomepage} from '../common/core/pages/custom-homepage.service';
import {MetaTagsService} from '../common/core/meta/meta-tags.service';
import {SearchTermLoggerService} from './help-center/front/search-term-logger.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    public isLoading = false;

    constructor (
        private el: ElementRef,
        private browserEvents: BrowserEvents,
        private renderer: Renderer2,
        private backendEvents: BackendEvents,
        private settings: Settings,
        private router: Router,
        private httpClient: AppHttpClient,
        private customHomepage: CustomHomepage,
        private metaTags: MetaTagsService,
        private searchTerm: SearchTermLoggerService,
    ) { }

    ngOnInit() {
        this.browserEvents.subscribeToEvents(this.el.nativeElement);
        this.settings.setHttpClient(this.httpClient);
        this.metaTags.init();

        // google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }

        // custom homepage
        this.customHomepage.select();

        this.backendEvents.init();
        this.searchTerm.init();
        this.enableTransitionOnChunkLoad();

    }

    /**
     * Show a transition animation when chunks
     * are being lazy loaded by angular.
     */
    private enableTransitionOnChunkLoad() {
        this.router.events
            .subscribe(e => {
                if (e instanceof RouteConfigLoadStart) {
                    this.isLoading = true;
                } else if (e instanceof RouteConfigLoadEnd) {
                    this.isLoading = false;
                }
            });
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }
}
