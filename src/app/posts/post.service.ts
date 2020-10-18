import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})

export class PostService{
    private posts : Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPost(){
        return [...this.posts];
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {title, content};
        this.posts.push(post);
        console.log(post);
        this.postsUpdated.next([...this.posts]);
    }
};





