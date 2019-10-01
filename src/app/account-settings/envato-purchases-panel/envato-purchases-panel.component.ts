import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {User} from '../../shared/models/User';
import {SocialAuthService} from '../../../common/auth/social-auth.service';
import {Toast} from '../../../common/core/ui/toast.service';
import {Settings} from '../../../common/core/config/settings.service';

@Component({
    selector: 'envato-purchases-panel',
    templateUrl: './envato-purchases-panel.component.html',
    styleUrls: ['./envato-purchases-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EnvatoPurchasesPanelComponent {
    @HostBinding('class.panel') accountSettingsPanel = true;
    @HostBinding('class.hidden') get envatoDisabled(): boolean {
        return !this.settings.get('envato.enable');
    }

    @Input() public user = new User();

    constructor(
        private social: SocialAuthService,
        private toast: Toast,
        public settings: Settings,
    ) {}

    public updatePurchases() {
        this.social.connect('envato').then(user => {
            this.user.social_profiles = user.social_profiles;
            this.user.purchase_codes = user['purchase_codes'];
            this.toast.open('Updated envato purchases.');
        });
    }
}
