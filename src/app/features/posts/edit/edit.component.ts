import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private postsService = inject(PostService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  postId = '';
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        take(1),
        switchMap((params) => {
          const id = params.get('id') || '';
          this.postId = id;
          return this.postsService.getById(id);
        }),
      )
      .subscribe({
        next: (post) => {
          if (!post) {
            this.errorMessage = 'Post not found.';
            this.isLoading = false;
            return;
          }

          const currentUser = this.authService.currentUser;

          if (!currentUser || currentUser.uid !== post.authorId) {
            this.router.navigate(['/posts', this.postId]);
            return;
          }

          this.form.patchValue({
            title: post.title,
            category: post.category,
            imageUrl: post.imageUrl,
            summary: post.summary,
            content: post.content,
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading post:', error);
          this.errorMessage = 'An error occurred while loading the post.';
          this.isLoading = false;
        },
      });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.errorMessage = 'You must be logged in to edit a post.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { title, category, imageUrl, summary, content } =
      this.form.getRawValue();

    try {
      await this.postsService.update(this.postId, {
        title: title.trim(),
        category: category.trim(),
        imageUrl: imageUrl.trim(),
        summary: summary.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      });

      this.router.navigate(['/posts', this.postId]);
    } catch (error: unknown) {
      console.error('Error updating post:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      switch (error.code) {
        case 'permission-denied':
          return 'You do not have permission to edit this post.';
        case 'unavailable':
          return 'Service unavailable. Please try again later.';
        default:
          return `Error: ${error.code}`;
      }
    }

    return 'Something went wrong. Please try again.';
  }
}
