import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Post } from '../../shared/interfaces/posts';
import { PostFormValue } from '../../shared/interfaces/post-form-value';
import { PostFormComponent } from '../../shared/post-form/post-form.component';

@Component({
  selector: 'app-create',
  imports: [PostFormComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {

  private postsService = inject(PostService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  async onCreate(formData: PostFormValue): Promise<void> {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a post.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      const userProfile = await this.userService.getUserById(currentUser.uid);

      if (!userProfile) {
        this.errorMessage = 'User profile not found.';
        return;
      }

      const postData: Post = {
        title: formData.title.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        authorId: currentUser.uid,
        authorUsername: userProfile.username,
        authorEmail: currentUser.email ?? userProfile.email,
        createdAt: new Date().toISOString(),
      };

      const docRef = await this.postsService.create(postData);
      await this.userService.addPostToUser(currentUser.uid, docRef.id);

      this.router.navigate(['/posts', docRef.id]);
    } catch (error: unknown) {
      console.error('Create post error:', error);
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
