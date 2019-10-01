import {Component, ViewEncapsulation} from '@angular/core';
import {Settings} from '../../../../common/core/config/settings.service';

@Component({
    selector: 'hc-header',
    templateUrl: './hc-header.component.html',
    styleUrls: ['./hc-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class HcHeaderComponent {
    constructor(public settings: Settings) {}
}
