import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Post } from './post.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment'

const BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable({
    providedIn: 'root'
})



export class PostService{
    private posts : Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http : HttpClient, private router: Router ){ }

    getPost(postsPerPage: number, currentPage: number){
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{ message:string, posts: Post[], maxPosts: number }>(BACKEND_URL+queryParams)
                .pipe(
                    map(postData => {
                           return{

                                posts: postData.posts.map( (post: any) => {
                                    return {
                                        id: post._id,
                                        title: post.title,
                                        content: post.content,
                                        imagePath: post.imagePath,
                                        creator: post.creator
                                    }
                                }),

                                maxPosts: postData.maxPosts

                        }
                    })
                )
                .subscribe (transformedPost => {
                    this.posts = transformedPost.posts;
                    this.postsUpdated.next({
                        posts: [...this.posts],
                        postCount: transformedPost.maxPosts
                    });
                })

        console.log(this.posts);
    }

    findPost(id: string){
        return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL+id)
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image)
        this.http
                .post <{message: string, post: Post}>(BACKEND_URL,postData)
                .subscribe( (resData) => {
                    this.router.navigate(['/'])
                });
    }

    deletePost(id: string){
        return this.http.delete(BACKEND_URL+id);

    }

    updatePost(id: string, title: string, content: string, image: File | string){
        let postData : Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image)
            postData.append('creator', null);
        }
        else {
            postData = {
                id,
                title,
                content,
                imagePath: image,
                creator: null
            }
        }
        this.http.put<{message: string, imagePath: string}>(BACKEND_URL+id, postData)
                 .subscribe((resData) => 
                {
                    this.router.navigate(['/'])
                })
    }
};





