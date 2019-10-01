import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {Article} from '../../../../shared/models/Article';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {slugifyString} from '../../../../../common/core/utils/slugify-string';

interface ArticleSettingsModalData {
    article: Article;
}

interface ArticleSettingsModel {
    slug?: string;
    description?: string;
    position?: number|string;
}

@Component({
    selector: 'article-settings-modal',
    templateUrl: './article-settings-modal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ArticleSettingsModalComponent {
    constructor(
        private dialogRef: MatDialogRef<ArticleSettingsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ArticleSettingsModalData,
    ) {
        this.hydrate();
    }

    public model: ArticleSettingsModel = {};

    public close(settings?: ArticleSettingsModel) {
        this.dialogRef.close(settings);
    }

    private hydrate() {
        this.model.slug = this.data.article.slug;
        this.model.description = this.data.article.description;
        this.model.position = this.data.article.position;
    }

    public confirm() {
        this.close({
            slug: slugifyString(this.model.slug),
            description: this.model.description,
            position: parseInt(this.model.position as string),
        });
    }
}
