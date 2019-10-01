import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindUsersModalComponent} from './find-users-modal.component';
import {MatDialogModule} from '@angular/material';
import {UiModule} from '../../core/ui/ui.module';

@NgModule({
    declarations: [
        FindUsersModalComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        UiModule,
    ],
    entryComponents: [
        FindUsersModalComponent,
    ]
})
export class FindUsersModalModule {
}
