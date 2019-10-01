import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from '../core/config/settings.service';
import {CurrentUser} from '../auth/current-user';
import {BreakpointsService} from '../core/ui/breakpoints.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {
    public leftColumnIsHidden = false;

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        public breakpoints: BreakpointsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.leftColumnIsHidden = this.breakpoints.isMobile$.value;

        // close left column when navigating between admin pages on mobile
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(e => {
                this.leftColumnIsHidden = this.breakpoints.isMobile$.value;
            });
    }

    public toggleLeftSidebar() {
        this.leftColumnIsHidden = !this.leftColumnIsHidden;
    }

    public getCustomSidebarItems() {
        return this.settings.get('vebto.admin.pages');
    }
}
