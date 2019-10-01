import { Directive, ElementRef } from '@angular/core';
import {InfiniteScroll} from '../../common/core/ui/infinite-scroll/infinite.scroll';
import {Conversation} from '../conversation/conversation.service';

@Directive({
    selector: '[conversationInfiniteScroll]'
})
export class ConversationInfiniteScrollDirective extends InfiniteScroll {
    constructor(
        protected el: ElementRef,
        private conversation: Conversation,
    ) {
        super();
    }

    protected getScrollContainer() {
        return document;
    }

    protected loadMoreItems() {
        this.conversation.replies.loadMore();
    }

    protected isLoading(): boolean {
        return this.conversation.replies.isLoading;
    }

    protected canLoadMore(): boolean {
        return this.conversation.replies.canLoadMore();
    }
}
