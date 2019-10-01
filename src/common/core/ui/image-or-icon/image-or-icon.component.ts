import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
import {Settings} from '../../config/settings.service';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'image-or-icon',
    templateUrl: './image-or-icon.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageOrIconComponent implements OnChanges {
    @Input() src: string;
    @Input() alt = '';
    @Input() className = '';

    public type$ = new BehaviorSubject<'absolute'|'relative'|'icon'>(null);

    constructor(public settings: Settings) {}

    ngOnChanges(): void {
        if ( ! this.src) return;
        if (this.src.indexOf('http') > -1) {
            this.type$.next('absolute');
        } else if (this.src.indexOf('.') > -1) {
            this.type$.next('relative');
        } else {
            this.type$.next('icon');
        }
    }
}
