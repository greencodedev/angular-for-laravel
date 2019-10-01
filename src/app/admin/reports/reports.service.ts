import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';

@Injectable()
export class ReportsService {
    constructor(private httpClient: AppHttpClient) {}

    /**
     * Get envato earnings for given perdiod.
     */
    public getEnvatoEarnings(filters = null) {
        return this.httpClient.get('reports/envato/earnings', filters);
    }

    /**
     * Get ticket counts for each day in given month.
     */
    public getTicketCountsForMonth(month, year = null) {
        const payload: any = {from_month: month};
        if (year) payload.year = year;

        return this.httpClient.get('reports/tickets/count/daily', payload);
    }

    /**
     * Get report on tickets for given time range.
     */
    public getTicketsReportForRange(params = null) {
        return this.httpClient.get('reports/tickets/range', params);
    }
}
