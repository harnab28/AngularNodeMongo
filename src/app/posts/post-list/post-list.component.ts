import {Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';

import { PostService } from '../post.service'
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    private postSub : Subscription;
    private authStatusSub: Subscription;

    userIsAuthenticated = false;
    isLoading: boolean = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];

    constructor(private postService : PostService, private authService: AuthService){

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
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListner()
                                 .subscribe(isAuthenticated => {
                                     this.userIsAuthenticated = isAuthenticated;
                                 });
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
        this.authStatusSub.unsubscribe();
    }
}