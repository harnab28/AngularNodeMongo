import {Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';

import { PostService } from '../post.service'
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    private postSub : Subscription;
    isLoading: boolean = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];

    constructor(private postService : PostService){

    }


    ngOnInit(){
        this.isLoading = true;
        this.postService.getPost(this.postsPerPage, this.currentPage);
        this.postSub = this.postService
                        .getPostUpdateListener()
                        .subscribe( (postsData: {posts: Post[], postCount: number}) => {
                        this.posts = postsData.posts;
                        this.isLoading = false;
                        this.totalPosts = postsData.postCount;
                    })
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPost(this.postsPerPage, this.currentPage);
    }

    
    onDelete( id: string ){
        this.isLoading = true;
        this.postService.deletePost(id).subscribe( () => {
            this.postService.getPost(this.postsPerPage, this.currentPage);
        });
    }


    ngOnDestroy()
    {
        this.postSub.unsubscribe();
    }
}