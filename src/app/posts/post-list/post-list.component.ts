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

    constructor(private postService : PostService){

    }

    ngOnInit(){
        this.posts = this.postService.getPost();
        this.postSub = this.postService.getPostUpdateListener()
                        .subscribe( (posts: Post[]) => {
                        this.posts = posts;
                    })
    }

    ngOnDestroy()
    {
        this.postSub.unsubscribe();
    }
}