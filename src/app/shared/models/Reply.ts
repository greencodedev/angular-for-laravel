import {Ticket} from './Ticket';
import {User} from './User';
import {FileEntry} from '../../../common/uploads/file-entry';

export class Reply {
    id: number;
    body: string;
    user_id: number;
    ticket_id: number;
    uuid?: string;
    type: string = 'replies';
    created_at?: string;
    updated_at?: string;
    uploads?: FileEntry[];
    ticket?: Ticket;
    user?: User;

    constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}