import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TicketsService} from '../tickets.service';
import {TagService} from '../../shared/tag.service';
import {Tag} from '../../shared/models/Tag';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Toast} from '../../../common/core/ui/toast.service';
import {MatMenuTrigger} from '@angular/material';

@Component({
    selector: 'add-tag-dropdown',
    templateUrl: './add-tag-dropdown.component.html',
    styleUrls: ['./add-tag-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddTagDropdownComponent implements OnInit {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild('input') input: ElementRef;

    @Input() ticketIds: number[] = [];
    @Output() tagAdded: EventEmitter<Tag> = new EventEmitter();

    public tags: Tag[];
    public tagQuery = new FormControl();

    constructor(
        private tickets: TicketsService,
        private tagService: TagService,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.bindTagQueryInput();

        this.trigger.menuOpened.subscribe(() => {
            this.input.nativeElement.focus();
        });

        this.trigger.menuClosed.subscribe(() => {
            this.clearSearchField();
        });
    }

    public open() {
        this.trigger.openMenu();
    }

    public close() {
        this.trigger.closeMenu();
    }

    public addTag(tagName: string) {
        this.tickets.addTag(tagName, this.ticketIds).subscribe(response => {
            this.clearSearchField();
            this.toast.open('Tag added');
            this.tagAdded.emit(response.data);
        });
    }

    public clearSearchField() {
        if ( ! this.tagQuery.value) return;
        this.tagQuery.setValue(null);
    }

    private bindTagQueryInput() {
        this.tagQuery.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(query => {
                if ( ! query) return;
                this.tagService.search(query)
                    .subscribe(response => this.tags = response.data);
            });
    }
}
