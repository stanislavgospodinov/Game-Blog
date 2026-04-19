import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../../shared/interfaces/posts';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  private postsService = inject(PostService);

  posts$: Observable<Post[]> = this.postsService.getAll();
}

