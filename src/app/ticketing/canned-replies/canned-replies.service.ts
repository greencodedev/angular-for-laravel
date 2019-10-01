import {Injectable} from '@angular/core';
import {CannedReply} from '../../shared/models/CannedReply';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {PaginatedBackendResponse} from '../../../common/core/types/paginated-backend-response';

interface RepliesIndexParams {
    query?: string;
    per_page?: number;
    user_id?: number;
    shared?: boolean;
}

@Injectable()
export class CannedRepliesService {
    constructor(private httpClient: AppHttpClient) {}

    public getReplies(params: RepliesIndexParams): PaginatedBackendResponse<CannedReply> {
        return this.httpClient.get('canned-replies', params);
    }

    public create(params): BackendResponse<CannedReply> {
        return this.httpClient.post('canned-replies', params);
    }

    public update(id: number, params): BackendResponse<CannedReply> {
        return this.httpClient.put('canned-replies/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('canned-replies', {ids});
    }
}
