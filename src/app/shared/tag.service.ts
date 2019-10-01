import {Injectable} from '@angular/core';
import {HttpCacheClient} from '../../common/core/http/http-cache-client';
import {BackendResponse} from '../../common/core/types/backend-response';
import {Tag} from './models/Tag';
import {PaginatedBackendResponse} from '../../common/core/types/paginated-backend-response';

@Injectable({
    providedIn: 'root'
})
export class TagService {
    private baseUri = 'tags';

    constructor(private http: HttpCacheClient) {}

    public getTags(params = {}): PaginatedBackendResponse<Tag> {
        return this.http.getWithCache(this.baseUri, params);
    }

    public createNew(data: Partial<Tag>): BackendResponse<{tag: Tag}> {
        return this.http.post(this.baseUri, data);
    }

    public update(id: number, data: Partial<Tag>): BackendResponse<{tag: Tag}> {
        return this.http.put(this.baseUri + '/' + id, data);
    }

    public deleteMultiple(ids: number[]) {
        return this.http.delete(this.baseUri + '/delete-multiple', {ids});
    }

    public search(query: string) {
        const params = {query, skip_status_tags: 1, per_page: 10};
        return this.http.get(this.baseUri, params);
    }
}
