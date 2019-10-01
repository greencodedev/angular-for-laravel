import {MatPaginator, MatSort} from '@angular/material';
import {Paginator} from '../../pagination/paginator.service';

export interface DataTableSourceConfig<T> {
    uri?: string;
    dataPaginator?: Paginator<T>;
    matPaginator?: MatPaginator;
    matSort?: MatSort;
    staticParams?: object;
    initialData?: T[];
}
