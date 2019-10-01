import {Component, ViewEncapsulation} from '@angular/core';
import {SettingsPanelComponent} from '../../../../common/admin/settings/settings-panel.component';

@Component({
    selector: 'envato-settings',
    templateUrl: './envato-settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class EnvatoSettingsComponent extends SettingsPanelComponent {
    /**
     * Import envato items as ticket categories.
     */
    public importEnvatoItems() {
        this.loading = true;

        this.http.post('envato/items/import').subscribe(() => {
            this.toast.open('Imported envato items');
            this.loading = false;
        });
    }

}
