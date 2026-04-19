import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { map, Observable, switchMap } from 'rxjs';
import { Post } from '../../../shared/interfaces/posts';

@Component({
  selector: 'app-details',
  imports: [AsyncPipe, RouterLink, DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  private route = inject(ActivatedRoute);
  private postsService = inject(PostService);
  private authService = inject(AuthService);
  private router = inject(Router);

  post$: Observable<Post | undefined> = this.route.paramMap.pipe(
    map(params => params.get('id') || ''),
    switchMap(id => this.postsService.getById(id)
  ));

  get currentUserId(): string | null {
    return this.authService.currentUser?.uid ?? null;
  }

  isOwner(post: Post): boolean {
    return this.currentUserId === post.authorId;
  }

  async onDelete(postId: string, authorId: string): Promise<void> {
    const confirmed = confirm ('Are you sure you want to delete this post?');

    if(!confirmed) {
      return;
    }

    try {
      await this.postsService.delete(postId);
      this.router.navigate(['/posts']);
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
}
