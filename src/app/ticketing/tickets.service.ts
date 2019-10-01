import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Ticket} from '../shared/models/Ticket';
import {Tag} from '../shared/models/Tag';
import {Reply} from '../shared/models/Reply';
import {AppHttpClient} from '../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../common/core/types/backend-response';
import {map} from 'rxjs/operators';
import {PaginatedBackendResponse} from '../../common/core/types/paginated-backend-response';
import {PaginationResponse} from '../../common/core/types/pagination-response';
import {User} from '../shared/models/User';
import {Article} from '../shared/models/Article';

export interface DraftPayload {
    body?: string;
    uploads?: number[];
}

export interface SearchAllResponse {
    data: {
        tickets: PaginationResponse<Ticket>;
        users: PaginationResponse<User>;
        articles: PaginationResponse<Article>;
    };
}

@Injectable()
export class TicketsService {
    constructor(private httpClient: AppHttpClient) { }

    public get(id: number): BackendResponse<{ticket: Ticket}> {
        return this.httpClient.get('tickets/' + id);
    }

    public create(payload: Partial<Ticket>) {
        return this.httpClient.post('tickets', payload);
    }

    public update(id: number, params: Partial<Ticket>): BackendResponse<{ticket: Ticket}> {
        return this.httpClient.put('tickets/' + id, params);
    }

    public saveDraft(ticketId: number, payload: DraftPayload, draftId?: number) {
        if (draftId) {
            return this.httpClient.put('replies/' + draftId, payload);
        } else {
            return this.httpClient.post('tickets/' + ticketId + '/drafts', payload);
        }
    }

    public saveReply(ticketId: number, payload: Object): BackendResponse<{data: Reply}> {
        return this.httpClient.post('tickets/' + ticketId + '/replies', payload);
    }

    public getReplies(ticketId: number, page = 1): PaginatedBackendResponse<Reply> {
        return this.httpClient.get('tickets/' + ticketId + '/replies', {page});
    }

    public addNote(ticketId: number, params: Object) {
        return this.httpClient.post('tickets/' + ticketId + '/notes', params);
    }

    public updateReply(replyId: number, payload) {
        return this.httpClient.put('replies/' + replyId, payload);
    }

    public search(query: string, params: Object = {}): BackendResponse<SearchAllResponse> {
        return this.httpClient.get('search/all/' + encodeURIComponent(query), params);
    }

    public getTickets(params): PaginatedBackendResponse<Ticket> {
        return this.httpClient.get('tickets', params);
    }

    public addTag(tagName: string, ids: number[]) {
        return this.httpClient.post('tickets/tags/add', {ids, tag: tagName});
    }

    public removeTag(tag: Tag, ids: number[]) {
        return this.httpClient.post('tickets/tags/remove', {ids, tag: tag.id});
    }

    public changeTicketStatus(ticketId: number, status: string) {
        return this.httpClient.post('tickets/status/change', {ids: [ticketId], status});
    }

    public changeMultipleTicketsStatus(ids: number[], newTag) {
        return this.httpClient.post('tickets/status/change', {ids, status: newTag.name});
    }

    public assign(ticketIds: number[], userId: number = null) {
        return this.httpClient.post('tickets/assign', {user_id: userId, tickets: ticketIds});
    }

    public deleteMultiple(ids: number[]) {
        return this.httpClient.delete('tickets', {ids});
    }

    public deleteDraft(id: number) {
        return this.httpClient.delete('drafts/' + id);
    }

    public deleteReply(id: number) {
        return this.httpClient.delete('replies/' + id);
    }

    /**
     * Get latest active ticket that has specified tag.
     */
    public getLatestActiveTicket(tagId: number): Observable<Ticket> {
        return this.httpClient.get('tickets?per_page=1&tag_id=' + tagId)
            .pipe(map((response: {pagination: PaginationResponse<Ticket>}) => {
                return response.pagination.data[0] || null;
            }));
    }

    /**
     * Get original email from which reply was created.
     */
    public getOriginalEmailForReply(id: number): Observable<{data: string}> {
        return this.httpClient.get('replies/' + id + '/original');
    }

    /**
     * Merge specified tickets.
     */
    public merge(id1: number, id2: number): Observable<Ticket> {
        return this.httpClient.post('tickets/merge/' + id1 + '/' + id2);
    }
}
