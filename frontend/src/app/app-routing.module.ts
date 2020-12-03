import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'postes', component: PostsListComponent },
  { path: 'postes/:id', component: PostDetailsComponent },
  { path: 'postes', component: PostsListComponent },
  { path: 'inscrits', component: UsersListComponent },
  { path: 'inscrits/:id', component: UserDetailsComponent },
  { path: 'ajouter', component: AddPostComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
