import { inject, Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Post, PostWriteData } from '../../shared/interfaces/posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private firestore = inject(Firestore);
  private postsCollection = collection(this.firestore, 'posts');

  getAll(): Observable<Post[]> {
    const q = query(this.postsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getById(id: string): Observable<Post | undefined> {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return docData(postDoc, {idField: 'id'}) as Observable<Post | undefined>;
  }

  getByAuthorId(authorId: string): Observable<Post[]> {
    const q = query(this.postsCollection, where('authorId', '==', authorId));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  create(post: PostWriteData) {
    return addDoc(this.postsCollection, post);
  }

  update(id: string, data: Partial<PostWriteData>) {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return updateDoc(postDoc, data);
  }

  delete(id: string) {
    const postDoc = doc(this.firestore, `post/${id}`);
    return deleteDoc(postDoc);
  }
}
