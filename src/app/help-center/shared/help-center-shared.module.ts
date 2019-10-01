import {NgModule} from '@angular/core';
import {ArticlesOrderSelectComponent} from './articles-order-select/articles-order-select.component';
import {HelpCenterService} from './help-center.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {ArticleComponent} from './article/article.component';
import {ArticleModalComponent} from './article-modal/article-modal.component';
import {ArticleFeedbackComponent} from './article-feedback/article-feedback.component';
import {ArticleResolve} from './article/article-resolve.service';
import {BreadCrumbsComponent} from '../front/breadcrumbs/breadcrumbs.component';
import {RouterModule} from '@angular/router';
import {CategoriesService} from './categories.service';
import {UpdateArticleLinksDirective} from './article/update-article-links.directive';
import {UiModule} from '../../../common/core/ui/ui.module';
import {MatAutocompleteModule, MatDialogModule, MatMenuModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule,
        UiModule,

        // material
        MatMenuModule,
        MatAutocompleteModule,
        MatDialogModule,
    ],
    declarations: [
        ArticleComponent,
        ArticlesOrderSelectComponent,
        ArticleModalComponent,
        ArticleFeedbackComponent,
        BreadCrumbsComponent,
        UpdateArticleLinksDirective,
    ],
    exports:      [
        ArticleComponent,
        ArticlesOrderSelectComponent,
        ArticleModalComponent,
        ArticleFeedbackComponent,
        BreadCrumbsComponent,
    ],
    entryComponents: [
        ArticleModalComponent
    ],
    providers: [
        HelpCenterService,
        CategoriesService,
        ArticleResolve,
    ],
})
export class HelpCenterSharedModule { }
