import {Injectable} from '@angular/core';
import {Tag} from '../shared/models/Tag';
import {AppHttpClient} from '../../common/core/http/app-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class MailboxTagsService {

    /**
     * All available tags.
     */
    public allTags: Tag[] = [];

    /**
     * Tags representing categories.
     */
    public categoryTags: Tag[] = [];

    /**
     * Ticket status tags (open, closed etc)
     */
    public statusTags: Tag[] = [];

    /**
     * Currently selected tag in mailbox.
     */
    public activeTag: Tag;

    /**
     * MailboxTagsService Constructor.
     */
    constructor(private httpClient: AppHttpClient) {}

    /**
     * Set specified tags on MailboxTags service.
     */
    public setTags(tags: Tag[]) {
        if ( ! tags) return;
        this.allTags = tags;
        this.statusTags = tags.filter(tag => tag.type === 'status');
        this.categoryTags = tags.filter(tag => tag.type === 'category');
    }

    /**
     * Refresh mailbox tags.
     */
    public refresh() {
        this.httpClient.get('tags/agent-mailbox').subscribe((tags: Tag[]) => {
            this.setTags(tags);
        });
    }

    /**
     * Check if currently active tag matches given id.
     */
    public activeTagIs(tag: Tag): boolean {
        if ( ! this.activeTag) return false;
        return this.activeTag.id === tag.id || this.activeTag.name === tag.name;
    }

    /**
     * Get currently active tag ID.
     */
    public getActiveTagId(): number {
        if (this.activeTag) {
            return this.activeTag.id;
        }
    }

    /**
     * Set currently active tag based on current url
     * or default to 'open' tag.
     */
    public setActiveTag(id: number|string) {
        this.activeTag = this.getTagByIdOrName(id);

        // if we failed to set active tag from url,
        // default to tag with name 'open'
        if ( ! this.activeTag) {
            this.activeTag = this.allTags.find(tag => tag.name === 'open');
        }
    }

    public getTagByIdOrName(idOrName: string|number) {
        return this.allTags.find(tag => {
            return tag.id === +idOrName || tag.name === idOrName;
        });
    }

    /**
     * Getter for category tags property.
     */
    public getCategoryTags() {
        return this.categoryTags;
    }

    /**
     * Getter for status tags property.
     */
    public getStatusTags(excludeMineTag = false) {
        if (excludeMineTag) {
            return this.statusTags.filter(tag => tag.name !== 'mine');
        } else {
            return this.statusTags;
        }
    }
}
