import {User} from './User';
import {Tag} from './Tag';
import {Reply} from './Reply';

export const AGENT_PERMISSION = 'tickets.update';

export class Ticket {
    id: number;
    subject: string;
    user_id: number;
    closed_at?: string;
    closed_by?: number;
    assigned_to?: number;
    created_at?: string;
    updated_at?: string;
    updated_at_formatted: string;
    user?: User;
    tags?: Tag[];
    categories?: Tag[];
    replies?: Reply[];
    replies_count?: Reply;
    latest_replies?: Reply[];
    latest_reply?: Reply;
    notes?: Reply[];

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
