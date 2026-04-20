import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Post } from '../../shared/interfaces/posts';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private postsService = inject(PostService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a post.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { title, category, imageUrl, summary, content } =
      this.form.getRawValue();

    try {
      const userProfile = await this.userService.getUserById(currentUser.uid);

      if (!userProfile) {
        this.errorMessage = 'User profile not found.';
        return;
      }

      const postData: Post = {
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        summary: summary.trim(),
        content: content.trim(),
        authorId: currentUser.uid,
        authorUsername: userProfile.username,
        authorEmail: currentUser.email ?? userProfile.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.postsService.create(postData);
      await this.userService.addPostToUser(currentUser.uid, docRef.id);

      this.router.navigate(['/posts', docRef.id]);
    } catch (error: unknown) {
      console.error('Error creating post:', error);
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
          return 'You do not have permission to create posts.';
        case 'unavailable':
          return 'Service unavailable. Please try again later.';
        default:
          return `Error: ${error.code}`;
      }
    }

    return 'Something went wrong. Please try again.';
  }
}
