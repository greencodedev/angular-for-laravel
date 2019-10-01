import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SuggestedArticlesDropdownComponent} from './suggested-articles-dropdown.component';
import {MatAutocompleteModule, MatIconModule} from '@angular/material';
import {UiModule} from '../../../common/core/ui/ui.module';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        UiModule,
        RouterModule,

        // material
        MatAutocompleteModule,
        MatIconModule,
    ],
    declarations: [
        SuggestedArticlesDropdownComponent,
    ],
    exports: [
        SuggestedArticlesDropdownComponent
    ]
})
export class SuggestedArticleDropdownModule {
}
