import { inject, Injectable } from '@angular/core';
import { ArticleComment } from '@interfaces/article-comment';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable, of } from 'rxjs';
import { Timestamp } from 'firebase/firestore/lite';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly firebaseService = inject(FirebaseService);

  sendComment(articleId: string, text: string, uid: string): Promise<void> {
    const commentsSubCollection =
      this.firebaseService.collection<ArticleComment>(
        `articles/${articleId}/comments`
      );
    const docRef = this.firebaseService.doc<ArticleComment>(
      commentsSubCollection
    );
    const commentId = docRef.id;
    const newComment: ArticleComment = {
      articleId,
      commentId,
      uid,
      text,
      createdAt: Timestamp.now(),
    };
    return this.firebaseService.setDoc(docRef, newComment);
  }

  deleteComment(articleId: string, commentId: string): Promise<void> {
    const docRef = this.firebaseService.doc(
      `articles/${articleId}/comments/${commentId}`
    );
    return this.firebaseService.deleteDoc(docRef);
  }

  getLatestArticleComments(
    articleId: string
  ): Observable<ArticleCommentWithAuthor[]> {
    if (!articleId) {
      return of([]);
    }
    return of([]);
  }
}
