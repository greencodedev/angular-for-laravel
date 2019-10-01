import {Component, NgZone, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Settings} from '../../core/config/settings.service';
import {Subject} from 'rxjs';

export interface RequestExtraCredentialsModalData {
    credentials: string[];
}

interface PossibleCredentials {
    email?: string;
    password?: string;
}

@Component({
    selector: 'request-extra-credentials-modal',
    templateUrl: './request-extra-credentials-modal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class RequestExtraCredentialsModalComponent implements OnInit {
    public model: PossibleCredentials = {};
    public credentialsToRequest: string[];
    public errors: PossibleCredentials = {};
    public onSubmit$ = new Subject<PossibleCredentials>();

    constructor(
        private dialogRef: MatDialogRef<RequestExtraCredentialsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RequestExtraCredentialsModalData,
        private zone: NgZone,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.zone.run(() => {
            this.credentialsToRequest = this.data.credentials;
        });
    }

    public shouldCredentialBeRequested(name: string): boolean {
        return this.credentialsToRequest.indexOf(name) > -1;
    }

    public confirm() {
        // this.dialogRef.close(Object.assign({}, this.model));
        this.onSubmit$.next({...this.model});
    }

    public close() {
        this.dialogRef.close();
    }

    public handleErrors(response: {messages: object}) {
        // we need to request user extra credentials again, for example
        // if email address user supplied previously already exists
        // we might need to request password for account with that email
        if (response['messages']['email']) {
            this.credentialsToRequest.push('password');
        }

        this.zone.run(() => {
            this.errors = response.messages;
        });
    }
}
