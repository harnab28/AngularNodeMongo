import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs/operators'
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class PostService{
    private posts : Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http : HttpClient, private router: Router ){ }
    getPost(){
        this.http.get<{ message:string, posts: Post[] }>('http://localhost:3000/api/posts')
                .pipe(
                    map(postData => {
                           return postData.posts.map( (post: any) => {
                                return {
                                    id: post._id,
                                    title: post.title,
                                    content: post.content
                                }
                        })
                    })
                )
                .subscribe (transformedPost => {
                    this.posts = transformedPost;
                    this.postsUpdated.next(this.posts);
                })
    }

    findPost(id: string){
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/'+id)
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title, content};
        this.http
                .post <{message: string, id: string}>('http://localhost:3000/api/posts',post)
                .subscribe( (resData) => {
                    //console.log(resData.message);
                    post.id = resData.id;
                    this.posts.push(post);
                    this.postsUpdated.next(this.posts);
                    this.router.navigate([''])
                });
    }

    deletePost(id: string){
        this.http.delete('http://localhost:3000/api/posts/'+id)
                 .subscribe(() => {
                      const updatedPost = this.posts.filter((post) => post.id !== id)
                      this.posts = updatedPost;
                      this.postsUpdated.next(this.posts); 
                 });

    }

    updatePost(id: string, title: string, content: string){
        const post = { id, title, content }
        this.http.put<{message: string}>('http://localhost:3000/api/posts/'+id, post)
                 .subscribe((putData) => 
                {
                     console.log(putData)
                     this.router.navigate(['']);
                })
    }
};





