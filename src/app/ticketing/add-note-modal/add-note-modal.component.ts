import {Component, ViewChild, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {TicketsService} from '../tickets.service';
import {Conversation} from '../../conversation/conversation.service';
import {TextEditorComponent} from '../../../common/text-editor/text-editor.component';
import {UploadsApiService} from '../../../common/uploads/uploads-api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Reply} from '../../shared/models/Reply';
import {UploadedFile} from '../../../common/uploads/uploaded-file';
import {UploadQueueService} from '../../../common/uploads/upload-queue/upload-queue.service';
import {FileEntry} from '../../../common/uploads/file-entry';

interface AddNoteModalData {
    ticketId: number;
}

interface AddNoteModalErrors {
    body?: string;
    attachments?: string;
    file?: string;
}

@Component({
    selector: 'add-note-modal',
    templateUrl: './add-note-modal.component.html',
    styleUrls: ['./add-note-modal.component.scss'],
    providers: [Conversation, UploadQueueService],
    encapsulation: ViewEncapsulation.None,
})
export class AddNoteModalComponent implements OnInit {
    @ViewChild('textEditor') textEditor: TextEditorComponent;

    public errors: AddNoteModalErrors = {};
    public attachments: any[] = [];

    constructor(
        private dialogRef: MatDialogRef<AddNoteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddNoteModalData,
        private ticketService: TicketsService,
        private uploads: UploadsApiService,
        private uploadQueue: UploadQueueService,
    ) {}

    ngOnInit() {
        this.textEditor.focus();
    }

    public close(note?: Reply) {
        this.textEditor.destroyEditor();
        this.dialogRef.close(note);
    }

    public confirm() {
        const payload = {body: this.textEditor.getContents(), attachments: this.attachments.map(attachment => attachment.id)};

        this.ticketService.addNote(this.data.ticketId, payload).subscribe(response => {
            this.close(response.data);
        }, errorResponse => this.errors = errorResponse.messages);
    }

    public uploadFiles(files: UploadedFile[]) {
        this.uploadQueue.start(files).subscribe(entry => {
            this.attachments = [...this.attachments, entry];
        });
    }

    public removeAttachment(entry: FileEntry) {
        for (let i = 0; i < this.attachments.length; i++) {
            if (this.attachments[i].id === entry.id) {
                this.attachments.splice(i, 1);
            }
        }
    }
}

