import { Post } from "./posts";

export interface CatalogState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
}