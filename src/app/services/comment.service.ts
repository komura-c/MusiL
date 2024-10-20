import { inject, Injectable } from '@angular/core';
import { ArticleComment } from '@interfaces/article-comment';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable, of } from 'rxjs';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  setDoc,
  CollectionReference,
  Timestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly firestore = inject(Firestore);

  sendComment(articleId: string, text: string, uid: string): Promise<void> {
    const commentsSubCollection = collection(
      this.firestore,
      `articles/${articleId}/comments`
    ) as CollectionReference<ArticleComment>;
    const commentId = commentsSubCollection.id;
    const newComment: ArticleComment = {
      articleId,
      commentId,
      uid,
      text,
      createdAt: Timestamp.now(),
    };
    const docRef = doc(
      this.firestore,
      `articles/${articleId}/comments/${commentId}`
    );
    return setDoc(docRef, newComment);
  }

  deleteComment(articleId: string, commentId: string): Promise<void> {
    const docRef = doc(
      this.firestore,
      `articles/${articleId}/comments/${commentId}`
    );
    return deleteDoc(docRef);
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
