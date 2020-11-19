import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  post = {
    title: '',
    description: '',
    published: false,
    userId: null
  };
  submitted = false;

  constructor(private PostService: PostService) { }

  ngOnInit(): void {
  }

  savePost(): void {
    const data = {
      title: this.post.title,
      description: this.post.description,
      userId: 2
    };

    this.PostService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newPost(): void {
    this.submitted = false;
    /*
    * TODO: Changer l'ID selon l'utilisateur
    */
    this.post = {
      title: '',
      description: '',
      published: false,
      userId: 2
    };
  }
}
