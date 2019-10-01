import {Article} from './Article';

export class Category {
    id: number;
    name: string;
    description?: string;
    position: number;
    parent_id?: number;
    hidden: boolean;
    created_at?: string;
    updated_at?: string;
    children?: Category[];
    parent?: Category;
    articles?: Article[];
    image?: string;
    articles_count?: number;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
