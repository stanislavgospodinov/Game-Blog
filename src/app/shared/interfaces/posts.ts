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
  createdAt: string;
  updatedAt?: string;
}
