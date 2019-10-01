import {Component, Inject} from '@angular/core';
import {TagService} from '../../../shared/tag.service';
import {Tag} from '../../../shared/models/Tag';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

interface CrupdateTagModalData {
   tag?: Tag;
}

interface CrupdateTagModalErrors {
    name?: string;
    display_name?: string;
    type?: string;
}

@Component({
    selector: 'crupdate-tag-modal',
    templateUrl: './crupdate-tag-modal.component.html',
    providers: [TagService],
})
export class CrupdateTagModalComponent {
    public tagTypes = ['status', 'category', 'custom'];
    public model = new Tag();
    public updating = false;
    public errors: CrupdateTagModalErrors = {};

    constructor(
        private dialogRef: MatDialogRef<CrupdateTagModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateTagModalData,
        private toast: Toast,
        private tags: TagService
    ) {
        this.hydrate();
    }

    public close(tag?: Tag) {
        this.errors = {};
        this.dialogRef.close(tag);
    }

    private hydrate() {
        if ( ! this.data.tag) return;
        this.updating = true;
        this.model = {...this.data.tag};
    }

    public confirm() {
        let request;

        if (this.updating) {
            request = this.tags.update(this.model.id, Object.assign({}, this.model));
        } else {
            request = this.tags.createNew(Object.assign({}, this.model));
        }

        request.subscribe(response => {
            this.toast.open('Tag ' + (this.updating ? 'Updated' : 'Created'));
            this.close(response.tag);
        }, errorResponse => this.errors = errorResponse.messages);
    }
}
