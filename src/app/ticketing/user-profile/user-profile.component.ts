import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Ticket} from '../../shared/models/Ticket';
import {User} from '../../shared/models/User';
import {Email} from '../../shared/models/Email';
import {FormControl, FormGroup} from '@angular/forms';
import {Paginator} from '../../../common/admin/pagination/paginator.service';
import {Users} from '../../../common/auth/users.service';
import {Toast} from '../../../common/core/ui/toast.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {Settings} from '../../../common/core/config/settings.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EmailAddressModalComponent} from '../../shared/email-address-modal/email-address-modal.component';
import {openUploadWindow} from '../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../common/uploads/upload-input-config';
import {AvatarValidator} from '../../../common/account-settings/avatar-validator';
import {TagsManagerComponent} from '../../shared/tags-manager/tags-manager.component';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {MatPaginator} from '@angular/material';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
    @ViewChild(MatPaginator) matPaginator: MatPaginator;
    @ViewChild(TagsManagerComponent) tagsManager: TagsManagerComponent;

    public tickets: Ticket[];
    public user = new User({purchase_codes: []});
    public detailsEditable = false;
    public dataSource: PaginatedDataTableSource<Ticket>;

    public profile = new FormGroup({
        details: new FormControl(),
        notes: new FormControl(),
    });

    constructor(
        private users: Users,
        private route: ActivatedRoute,
        private toast: Toast,
        private modal: Modal,
        private avatarValidator: AvatarValidator,
        public currentUser: CurrentUser,
        public settings: Settings,
        private paginator: Paginator<Ticket>,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.hydrateProfile(data.user);
            this.bindFormControls();
            this.createDataSource();
        });

        this.detailsEditable = this.currentUser.hasPermission('users.update');
    }

    public openAddEmailModal() {
        this.modal.show(EmailAddressModalComponent, {userId: this.user.id}).afterClosed().subscribe(email => {
            this.user.secondary_emails.push(new Email({address: email}));
        });
    }

    public removeEmail(emailAddress: string) {
        this.users.removeEmail(this.user.id, {emails: [emailAddress]}).subscribe(() => {
            const index = this.user.secondary_emails.findIndex(email => email.address === emailAddress);
            this.user.secondary_emails.splice(index, 1);
        });
    }

    public openAvatarUploadDialog() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(files => {
            if (this.avatarValidator.validateWithToast(files[0]).failed) return;

            this.users.uploadAvatar(this.user.id, files).subscribe(user => {
                this.user.avatar = user.avatar;
                this.currentUser.set('avatar', user.avatar);
                this.toast.open('Avatar updated');
            }, response => {
                const key = Object.keys(response.messages)[0];
                this.toast.open(response.messages[key]);
            });
        });
    }

    public deleteAvatar() {
        this.users.deleteAvatar(this.user.id).subscribe(user => {
            this.user.avatar = user.avatar;
            this.toast.open('Avatar removed.');
        });
    }

    public syncUserTags(tags: string[]) {
        this.users.syncTags(this.user.id, {tags}).subscribe();
    }

    public refreshTicketsList() {
        this.dataSource.reset();
    }

    private hydrateProfile(user: User) {
        this.user = user;
        this.tagsManager.selectedTags = user.tags.map(tag => tag.name);

        if ( ! user.details) return;

        this.profile.setValue({
            details: user.details.details,
            notes: user.details.notes
        });
    }

    private createDataSource() {
        this.dataSource = new PaginatedDataTableSource({
            uri: 'tickets',
            staticParams: {user_id: this.user.id},
            dataPaginator: this.paginator,
            matPaginator: this.matPaginator,
        }).init();
    }

    private bindFormControls() {
        this.profile.valueChanges
            .pipe(debounceTime(600), distinctUntilChanged())
            .subscribe(payload => {
                this.users.updateDetails(this.user.id, payload).subscribe(() => {
                    this.toast.open('Updated user details.');
                });
            });
    }
}
