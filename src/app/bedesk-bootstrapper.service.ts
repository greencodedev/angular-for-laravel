import {Injectable} from '@angular/core';
import {BootstrapData, Bootstrapper} from '../common/core/bootstrapper.service';
import {Tag} from './shared/models/Tag';
import {MailboxTagsService} from './ticketing/mailbox-tags.service';

interface BedeskBootstrapData extends BootstrapData {
    tags: Tag[];
}

@Injectable()
export class BedeskBootstrapper extends Bootstrapper {
    protected handleData(encodedData: string): BedeskBootstrapData {
        const data = super.handleData(encodedData) as BedeskBootstrapData;

        this.injector.get(MailboxTagsService).setTags(data.tags);

        return data;
    }
}
