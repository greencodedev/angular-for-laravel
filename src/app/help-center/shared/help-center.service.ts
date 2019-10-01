import {Injectable} from '@angular/core';
import {Article} from '../../shared/models/Article';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {HttpCacheClient} from '../../../common/core/http/http-cache-client';
import {PaginatedBackendResponse} from '../../../common/core/types/paginated-backend-response';
import {SearchTermLoggerService} from '../front/search-term-logger.service';
import {tap} from 'rxjs/operators';
import {PaginationResponse} from '../../../common/core/types/pagination-response';
import {Category} from '../../shared/models/Category';

@Injectable()
export class HelpCenterService {
    constructor(
        public httpClient: HttpCacheClient,
        private searchTerm: SearchTermLoggerService,
    ) {}

    /**
     * Search help center articles.
     */
    public findArticles(query, params: {categories?: number[], per_page?: number, bodyLimit?: number}): PaginatedBackendResponse<Article> {
        return this.httpClient.get('search/articles/' + encodeURIComponent(query), params)
            .pipe(tap((response: {pagination: PaginationResponse<Article>}) => {
                this.searchTerm.log(query, response.pagination.data, params.categories);
            }));
    }

    /**
     * Create new help center article.
     */
    public createArticle(payload): BackendResponse<{data: Article}> {
        return this.httpClient.post('help-center/articles', payload);
    }

    /**
     * Update existing help center article.
     */
    public updateArticle(payload): BackendResponse<{data: Article}> {
        return this.httpClient.put('help-center/articles/' + payload.id, payload);
    }

    /**
     * Submit user feedback about specified article.
     */
    public submitArticleFeedback(id: number, payload: Object) {
        return this.httpClient.post('help-center/articles/' + id + '/feedback', payload);
    }

    /**
     * Fetch help center articles.
     */
    public getArticles(params = null): PaginatedBackendResponse<Article> {
        return this.httpClient.get('help-center/articles', params);
    }

    /**
     * Get a single help center article matching given id.
     */
    public getArticle(id: number, params?): BackendResponse<{article: Article}> {
        return this.httpClient.get('help-center/articles/' + id, params);
    }

    /**
     * Get categories, child categories and articles for help center front page.
     */
    public getDataForHelpCenterFrontPage(): BackendResponse<{categories: Category[]}> {
        return this.httpClient.getWithCache('help-center');
    }

    /**
     * Get child categories and articles for specified parent category.
     */
    public getDataForHelpCenterSidenav(categoryId: number): BackendResponse<{categories: Category[]}> {
        return this.httpClient.getWithCache('help-center/sidenav', {categoryId});
    }

    /**
     * Delete articles with given ids.
     */
    public deleteArticles(articleIds: number[]) {
        return this.httpClient.delete('help-center/articles', {ids: articleIds});
    }
}
