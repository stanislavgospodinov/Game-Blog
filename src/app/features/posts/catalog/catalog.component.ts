import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CatalogState } from '../../../shared/interfaces/catalog-state';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, TruncatePipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  private postsService = inject(PostService);

  state$: Observable<CatalogState> = this.postsService.getAll().pipe(
    map((posts) => ({
      posts,
      isLoading: false,
      error: null,
    })),
    startWith({
      posts: [],
      isLoading: true,
      error: null,
    }),
    catchError(() =>
      of({
        posts: [],
        isLoading: false,
        error: 'Failed to load posts.',
      }),
    )
  );
}
