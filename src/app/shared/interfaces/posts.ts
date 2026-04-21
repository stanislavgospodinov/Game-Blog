import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Post {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  summary: string;
  content: string;
  authorId: string;
  authorUsername: string;
  authorEmail: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type PostWriteData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
};
