import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostFormValue } from '../interfaces/post-form-value';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
  private fb = inject(FormBuilder);

  @Input() submitLabel = 'Save';
  @Input() isSubmitting = false;
  @Input() set initialData(value: Partial<PostFormValue> | null) {
    if(!value) {
      return;
    }
    this.form.patchValue({
      title: value.title ?? '',
      category: value.category ?? '',
      imageUrl: value.imageUrl ?? '',
      summary: value.summary ?? '',
      content: value.content ?? '',
    });
  }

  @Output() formSubmit = new EventEmitter<PostFormValue>();

  categories = [
    'Action',
    'Adventure',
    'RPG',
    'Racing',
    'FPS',
    'Strategy',
    'Indie',
    'Sports',
    'Horror',
    'Simulation',
    'Puzzle',
    'MMO',
    'Fighting',
  ];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }
}
