import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

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

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.retrievePosts();
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
}
