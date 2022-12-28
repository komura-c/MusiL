import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ArticleComment } from '@interfaces/article-comment';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { UserData } from '@interfaces/user';
import firebase from 'firebase/compat/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  sendComment(articleId: string, text: string, uid: string): Promise<void> {
    const commentId = this.db.createId();
    const newComment: ArticleComment = {
      articleId,
      commentId,
      uid,
      text,
      createdAt: firebase.firestore.Timestamp.now(),
    };
    return this.db
      .doc<ArticleComment>(`articles/${articleId}/comments/${commentId}`)
      .set(newComment);
  }

  deleteComment(articleId: string, commentId: string): Promise<void> {
    return this.db
      .doc<ArticleComment>(`articles/${articleId}/comments/${commentId}`)
      .delete();
  }

  getLatestArticleComments(
    articleId: string
  ): Observable<ArticleCommentWithAuthor[]> {
    const sorted: Observable<ArticleComment[]> = this.db
      .doc(`articles/${articleId}`)
      .collection<ArticleComment>('comments', (ref) =>
        ref.orderBy('createdAt', 'asc').limit(30)
      )
      .valueChanges();
    return this.getArticleCommentsWithAuthors(sorted);
  }

  getArticleCommentsWithAuthors(
    sorted: Observable<ArticleComment[]>
  ): Observable<ArticleCommentWithAuthor[]> {
    let comments: ArticleComment[];
    return sorted.pipe(
      switchMap((commentsArray: ArticleComment[]) => {
        if (commentsArray?.length) {
          comments = commentsArray;
          const authorIds: string[] = commentsArray.map((post) => post.uid);
          const authorUniqueIds: string[] = Array.from(new Set(authorIds));
          return combineLatest(
            authorUniqueIds.map((userId) => {
              return this.userService.getUserData(userId);
            })
          );
        } else {
          return of([]);
        }
      }),
      map((users: UserData[]) => {
        if (comments?.length) {
          return comments.map((comment: ArticleComment) => {
            const result: ArticleCommentWithAuthor = {
              ...comment,
              author: users?.find((user: UserData) => user.uid === comment.uid),
            };
            return result;
          });
        } else {
          return null;
        }
      })
    );
  }
}
