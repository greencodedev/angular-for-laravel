import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {HelpCenterComponent} from './help-center.component';
import {HelpCenterSharedModule} from '../shared/help-center-shared.module';
import {HelpCenterResolve} from './help-center-resolve.service';
import {ArticleHostComponent} from './article-host/article-host.component';
import {BreadCrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {CategoryComponent} from './category/category.component';
import {CategoryResolve} from './category/category-resolve.service';
import {HcHeaderComponent} from './hc-header/hc-header.component';
import {TopicsPanelComponent} from './topics-panel/topics-panel.component';
import {CustomerFooterComponent} from '../../shared/customer-footer/customer-footer.component';
import {HcSearchPageComponent} from './hc-search-page/hc-search-page.component';
import {HcSearchPageResolve} from './hc-search-page/hc-search-page-resolve.service';
import {HelpCenterRoutingModule} from './help-center.routing';
import { HcSidenavComponent } from './hc-sidenav/hc-sidenav.component';
import {TextEditorModule} from '../../../common/text-editor/text-editor.module';
import {UiModule} from '../../../common/core/ui/ui.module';
import { MultiProductComponent } from './home/multi-product/multi-product.component';
import { ArticleContentComponent } from './article-host/article-content/article-content.component';
import { ArticleGridComponent } from './home/article-grid/article-grid.component';
import {SuggestedArticleDropdownModule} from '../suggested-articles-dropdown/suggested-article-dropdown.module';

@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        TextEditorModule,
        HelpCenterSharedModule,
        SuggestedArticleDropdownModule,
        HelpCenterRoutingModule,
        UiModule,
    ],
    declarations: [
        HelpCenterComponent,
        HcHeaderComponent,
        CategoryComponent,
        ArticleHostComponent,
        TopicsPanelComponent,
        HcSearchPageComponent,
        HcSidenavComponent,
        MultiProductComponent,
        ArticleContentComponent,
        ArticleGridComponent,
    ],
    exports:      [BreadCrumbsComponent, CustomerFooterComponent],
    providers:    [HelpCenterResolve, CategoryResolve, HcSearchPageResolve]
})
export class HelpCenterModule { }
