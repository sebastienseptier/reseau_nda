import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  currentPost = null;
  message = '';
  tags = null;

  constructor(
    private postService: PostService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getPost(this.route.snapshot.paramMap.get('id'));
    this.retrieveTags();
  }

  getPost(id): void {
    this.postService.get(id)
      .subscribe(
        data => {
          this.currentPost = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status): void {
    const data = {
      title: this.currentPost.title,
      description: this.currentPost.description,
      published: status
    };

    this.postService.update(this.currentPost.id, data)
      .subscribe(
        response => {
          this.currentPost.published = status;
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  updatePost(): void {
    this.postService.update(this.currentPost.id, this.currentPost)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The Post was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deletePost(): void {
    this.postService.delete(this.currentPost.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/postes']);
        },
        error => {
          console.log(error);
        });
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
    if (tagId && this.currentPost.tags)
      return this.currentPost.tags.find(t => t.id == tagId);
    else
      return null;
  }

  async toggleTagAssociation(tagId) {
    let response;

    if (!this.checkUsedTags(tagId)) {
      console.log("add")
      const data = {
        postId: this.currentPost.id,
        tagId: tagId
      };
      response = await this.postService.addTag(data);
    }
    else {
      console.log("delete")
      response = await this.postService.deleteTag(this.currentPost.id, tagId);
    }
    this.message = response.message;
    this.getPost(this.route.snapshot.paramMap.get('id'));
  }
}
