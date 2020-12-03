import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: any;
  currentUser = null;
  currentIndex = -1;
  name = '';

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  moment: any = moment;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  getRequestParams(searchName, page, pageSize): any {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (searchName) {
      params[`name`] = searchName;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveUsers(): void {
    const params = this.getRequestParams(this.name, this.page, this.pageSize);

      this.userService.getAll(params)
      .subscribe(
        data => {
          const { users, totalItems } = data;
          this.users = users;
          this.count = totalItems;
          console.log(data);
          console.log(data.users);
        },
        error => {
          console.log(error);
        });
    
  }

  handlePageChange(event): void {
    this.page = event;
    this.retrieveUsers();
  }

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveUsers();
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = null;
    this.currentIndex = -1;
  }

  setActiveUser(User, index): void {
    this.currentUser = User;
    this.currentIndex = index;
  }

  removeAllUsers(): void {
    this.userService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.retrieveUsers();
        },
        error => {
          console.log(error);
        });
  }
}
