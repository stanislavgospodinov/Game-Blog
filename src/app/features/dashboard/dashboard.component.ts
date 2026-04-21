import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PostService } from '../../core/services/post.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private postsService = inject(PostService);

  posts$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of([]);
      }

      return this.postsService.getByAuthorId(user.uid);
    }),
  );
}
