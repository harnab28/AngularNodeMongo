import {Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';

import { PostService } from '../post.service'
import { Post } from '../post.model';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    private postSub : Subscription;
    isLoading: boolean = false;

    constructor(private postService : PostService){

    }

    onDelete( id: string ){
        this.postService.deletePost(id);
    }

    ngOnInit(){
        this.isLoading = true;
        this.postService.getPost();
        this.postSub = this.postService.getPostUpdateListener()
                        .subscribe( (posts: Post[]) => {
                        this.posts = posts;
                        this.isLoading = false;
                    })
    }

    ngOnDestroy()
    {
        this.postSub.unsubscribe();
    }
}