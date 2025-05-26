import { inject, Injectable } from '@angular/core';
import { ArticleComment } from '@interfaces/article-comment';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable, of } from 'rxjs';
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  CollectionReference,
  Timestamp,
} from '@angular/fire/firestore/lite';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly firebaseService = inject(FirebaseService);

  sendComment(articleId: string, text: string, uid: string): Promise<void> {
    const commentsSubCollection = collection(
      this.firebaseService.firestore,
      `articles/${articleId}/comments`
    ) as CollectionReference<ArticleComment>;
    const docRef = doc(commentsSubCollection);
    const commentId = docRef.id;
    const newComment: ArticleComment = {
      articleId,
      commentId,
      uid,
      text,
      createdAt: Timestamp.now(),
    };
    return setDoc(docRef, newComment);
  }

  deleteComment(articleId: string, commentId: string): Promise<void> {
    const docRef = doc(
      this.firebaseService.firestore,
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
