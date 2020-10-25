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
                                    content: post.content,
                                    imagePath: post.imagePath
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
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/'+id)
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
                .post <{message: string, post: Post}>('http://localhost:3000/api/posts',postData)
                .subscribe( (resData) => {
                    //console.log(resData.message);
                    const post: Post = {
                      id: resData.post.id,
                      title: title,
                      content: content,
                      imagePath: resData.post.imagePath
                    };
                    this.posts.push(post);
                    this.postsUpdated.next([...this.posts]);
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

    updatePost(id: string, title: string, content: string, image: File | string){
        let postData : Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image)
        }
        else {
            postData = {
                id,
                title,
                content,
                imagePath: image
            }
        }
        this.http.put<{message: string}>('http://localhost:3000/api/posts/'+id, postData)
                 .subscribe((resData) => 
                {
                    const updatedPost = [...this.posts];
                    const oldPostIndex = updatedPost.findIndex(p => p.id === id);
                    const post : Post = {
                        id,
                        title, 
                        content,
                        imagePath: resData.imagePath
                    }
                    updatedPost[oldPostIndex] = post;
                    this.posts = updatedPost;
                    this.postsUpdated.next([...this.posts]);
                    this.router.navigate(['/'])
                })
    }
};





