import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { Post, PostWriteData } from '../../shared/interfaces/posts';

type RawPost = Omit<Post, 'createdAt' | 'updatedAt'> & {
  createdAt?: unknown;
  updatedAt?: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);
  private postsCollection = collection(this.firestore, 'posts');

  getAll(): Observable<Post[]> {
    return runInInjectionContext(this.injector, () => {
      const q = query(this.postsCollection, orderBy('createdAt', 'desc'));
      return collectionData(q, { idField: 'id' }).pipe(
        map((posts) => posts.map((post) => this.normalizePost(post as RawPost))),
      ) as Observable<Post[]>;
    });
  }

  getById(id: string): Observable<Post | undefined> {
    return runInInjectionContext(this.injector, () => {
      const postDoc = doc(this.firestore, `posts/${id}`);
      return docData(postDoc, { idField: 'id' }).pipe(
        map((post) => (post ? this.normalizePost(post as RawPost) : undefined)),
      ) as Observable<Post | undefined>;
    });
  }

  getByAuthorId(authorId: string): Observable<Post[]> {
    return runInInjectionContext(this.injector, () => {
      const q = query(this.postsCollection, where('authorId', '==', authorId));
      return collectionData(q, { idField: 'id' }).pipe(
        map((posts) => posts.map((post) => this.normalizePost(post as RawPost))),
      ) as Observable<Post[]>;
    });
  }

  create(post: PostWriteData) {
    return addDoc(this.postsCollection, post);
  }

  update(id: string, data: Partial<PostWriteData>) {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return updateDoc(postDoc, data);
  }

  delete(id: string) {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postDoc);
  }

  private normalizePost(post: RawPost): Post {
    return {
      ...post,
      createdAt: this.normalizeDate(post.createdAt),
      updatedAt: this.normalizeDate(post.updatedAt),
    };
  }

  private normalizeDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'seconds' in value &&
      typeof value.seconds === 'number'
    ) {
      const nanoseconds =
        'nanoseconds' in value && typeof value.nanoseconds === 'number'
          ? value.nanoseconds
          : 0;

      return new Timestamp(value.seconds, nanoseconds).toDate();
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsedDate = new Date(value);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return null;
  }
}
