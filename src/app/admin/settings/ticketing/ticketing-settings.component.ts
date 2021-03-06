import {Component, ViewEncapsulation} from '@angular/core';
import {SettingsPanelComponent} from '../../../../common/admin/settings/settings-panel.component';

@Component({
    selector: 'ticketing-settings',
    templateUrl: './ticketing-settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TicketingSettingsComponent extends SettingsPanelComponent {}
