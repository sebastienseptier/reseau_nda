import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { TagService } from 'src/app/services/tag.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
    userId: null,
    tagIds: []
  };
  submitted = false;
  tags = null;

  constructor(private PostService: PostService, private TokenStorageService: TokenStorageService, private tagService: TagService) { }

  ngOnInit(): void {
    this.retrieveTags();
  }

  savePost(): void {
    let user = this.TokenStorageService.getUser();
    const data = {
      title: this.post.title,
      description: this.post.description,
      userId: user.id,
      tagIds: this.post.tagIds
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
    let user = this.TokenStorageService.getUser();
    this.submitted = false;

    this.post = {
      title: '',
      description: '',
      published: false,
      userId: user.id,
      tagIds: []
    };
  }
  
  retrieveTags(): void {
    this.tagService.getAll()
      .subscribe(
        data => {
          this.tags = data;
        },
        error => {
          console.log(error);
        });
  }

  checkUsedTags(tagId) {
    if (tagId && this.post.tagIds)
      return this.post.tagIds.find(t => t == tagId);
    else
      return null;
  }

  async toggleTagAssociation(tagId) {

    if (!this.checkUsedTags(tagId)) {
      this.post.tagIds.push(tagId);
    }
    else {
      this.post.tagIds = this.post.tagIds.filter(e => e !== tagId)
    }
    console.log(this.post.tagIds);
  }
}
