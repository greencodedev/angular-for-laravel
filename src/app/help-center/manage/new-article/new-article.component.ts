import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleSettingsModalComponent} from './article-settings-modal/article-settings-modal.component';
import {CategoriesManagerComponent} from '../categories-manager/categories-manager.component';
import {HelpCenterService} from '../../shared/help-center.service';
import {ArticleModalComponent} from '../../shared/article-modal/article-modal.component';
import {Article} from '../../../shared/models/Article';
import {CategoryModalComponent} from '../category-modal/category-modal.component';
import {Category} from '../../../shared/models/Category';
import {TextEditorComponent} from '../../../../common/text-editor/text-editor.component';
import {Toast} from '../../../../common/core/ui/toast.service';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {TagsManagerComponent} from '../../../shared/tags-manager/tags-manager.component';

@Component({
    selector: 'new-article',
    templateUrl: './new-article.component.html',
    styleUrls: ['./new-article.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NewArticleComponent implements OnInit {
    @ViewChild(TextEditorComponent) private textEditor: TextEditorComponent;
    @ViewChild(CategoriesManagerComponent) private categoriesManager: CategoriesManagerComponent;
    @ViewChild(TagsManagerComponent) private tagsManager: TagsManagerComponent;

    public updating = false;
    public articleModel: Article = new Article({categories: [], draft: 0});

    constructor(
        private modal: Modal,
        private helpCenter: HelpCenterService,
        private toast: Toast,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(resolves => this.hydrate(resolves['data']));
    }

    public getCategories(): number[] {
        return this.articleModel.categories.map(category => category.id);
    }

    public saveOrUpdateArticle() {
        const method = this.articleModel.id ? 'updateArticle' : 'createArticle';
        this.updating = true;

        this.helpCenter[method](this.getPayload()).subscribe(response => {
            this.toast.open('Article ' + (this.articleModel.id ? 'updated.' : 'created.'));
            this.router.navigateByUrl('help-center/manage/articles');
        }, errors => {
            const message = errors['messages'][Object.keys(errors['messages'])[0]];
            this.toast.open(message);
            this.updating = false;
        });
    }

    public openPreviewModal() {
        this.modal.open(
            ArticleModalComponent,
            {article: this.getPayload()},
            {panelClass: 'article-modal-container'}
        );
    }

    public openArticleSettingsModal() {
        this.modal.show(ArticleSettingsModalComponent, {article: this.articleModel})
            .afterClosed()
            .subscribe(data => {
                if ( ! data) return;
                this.articleModel = Object.assign(this.articleModel, data);
            });
    }

    private getPayload() {
        const model  = Object.assign({}, this.articleModel) as Object;
        model['body'] = this.textEditor.getContents();
        model['categories'] = this.categoriesManager.getSelectedCategories();
        model['tags'] = this.tagsManager.getSelectedTags();
        return model;
    }

    private hydrate(data: {article?: Article, categories?: Category[]}) {
        if (data.article) {
            this.articleModel = data.article;
            this.textEditor.setContents(data.article.body);
            this.categoriesManager.setSelectedCategories(this.articleModel.categories);
            this.tagsManager.setSelectedTags(this.articleModel.tags.map(tag => tag.name));
        }

        if (data.categories) {
            this.categoriesManager.setCategories(data.categories);
        }
    }

    public openNewCategoryModal() {
        this.modal.show(CategoryModalComponent)
            .afterClosed()
            .subscribe(category => {
                if ( ! category) return;
                this.categoriesManager.refresh()
                    .then(() => this.categoriesManager.toggle(category));
            });
    }
}
