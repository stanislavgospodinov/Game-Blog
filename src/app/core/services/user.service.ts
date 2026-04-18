import { inject, Injectable } from '@angular/core';
import {
  arrayRemove,
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AppUser } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  createUser(user: AppUser) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userRef, user);
  }

  async getUserById(uid: string): Promise<AppUser | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as AppUser;
  }

  updateUser(uid: string, data: Partial<AppUser>) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, data);
  }

  addPostToUser(uid: string, postId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);

    return updateDoc(userRef, {
      posts: arrayUnion(postId),
    });
  }

  removePostFromUser(uid: string, postId: string) {
    const userRef = doc(this.firestore, `users/${uid}`);

    return updateDoc(userRef, {
      posts: arrayRemove(postId),
    });
  }
}
