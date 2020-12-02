import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { TagService } from 'src/app/services/tag.service';
import * as moment from 'moment';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  posts: any;
  currentPost = null;
  currentIndex = -1;
  title = '';
  tags = null;
  usedTagIds = [];

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  moment: any = moment;

  constructor(private postService: PostService,
    private tagService: TagService) { }

  ngOnInit(): void {
    this.retrievePosts();
    this.retrieveTags();
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

  getRequestParams(searchTitle, page, pageSize): any {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrievePosts(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    if (this.usedTagIds.length === 0) {
      this.postService.getAll(params)
      .subscribe(
        data => {
          const { posts, totalItems } = data;
          this.posts = posts;
          this.count = totalItems;
          console.log(data);
          console.log(data.posts);
        },
        error => {
          console.log(error);
        });
    }
    else {
      this.postService.findByTagsAndTitle(params, this.usedTagIds.toString())
      .subscribe(
        data => {
          const { posts, totalItems } = data;
          this.posts = posts;
          this.count = totalItems;
          console.log(data);
          console.log(data.posts);
        },
        error => {
          console.log(error);
        });
    }
    

  }

  handlePageChange(event): void {
    this.page = event;
    this.retrievePosts();
  }

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrievePosts();
  }

  refreshList(): void {
    this.retrievePosts();
    this.currentPost = null;
    this.currentIndex = -1;
  }

  setActivePost(Post, index): void {
    this.currentPost = Post;
    this.currentIndex = index;
  }

  removeAllPosts(): void {
    this.postService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.retrievePosts();
        },
        error => {
          console.log(error);
        });
  }

  checkUsedTags(tagId) {
    if (tagId && this.usedTagIds)
      return this.usedTagIds.find(id => id == tagId);
    else
      return false;
  }

  toggleTagFilter(tagId): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    if (this.checkUsedTags(tagId)) {
      var index = this.usedTagIds.indexOf(tagId);
      if (index !== -1) {
        this.usedTagIds.splice(index, 1);
      }
    }
    else {
      this.usedTagIds.push(tagId);
    }

    if (this.usedTagIds.length > 0) {
      this.postService.findByTagsAndTitle(params, this.usedTagIds)
      .subscribe(
        data => {
          const { posts, totalItems } = data;
          this.posts = posts;
          this.count = totalItems;
          console.log(data);
          console.log(data.posts);
        },
        error => {
          console.log(error);
        });
    }
    else {
      this.retrievePosts();
    }
  }
}
