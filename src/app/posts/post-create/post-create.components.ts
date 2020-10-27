import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post } from '../post.model';
import { mimeType } from "./mime-type.validator";

import { PostService } from '../post.service'

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

    isLoading: boolean = false;
    private postId = null;
    private mode = 'create';
    imagePreview: string
    post: Post
    form: FormGroup

    constructor(private postService: PostService, private route: ActivatedRoute) {

    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0]
        this.form.patchValue({ image: file })
        this.form.get('image').updateValueAndValidity();
        console.log(file);
        console.log(this.form.value);
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        reader.readAsDataURL(file);
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            content: new FormControl(null, { validators: [Validators.required] }),
            image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.has('postId')) {
                this.isLoading = true;
                this.mode = 'edit'
                this.postId = params.get('postId')
                this.postService.findPost(this.postId).subscribe((postData) => {
                    this.post = {
                      id: postData._id,
                      title: postData.title,
                      content: postData.content,
                      imagePath: postData.imagePath,
                      creator: postData.creator
                    }
                    this.isLoading = false;
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    })
                })

            }
            else {
                this.mode = 'create'
                this.postId = null
            }
        })
    }
    onSavePost() {
        if (this.form.invalid)
            return;
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
            console.log(this.form.value.image)
        }
        else {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }
}