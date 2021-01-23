import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserData } from './interfaces/user';

const config = functions.config();
const db = admin.firestore();

export const sitemap = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const lines = [];
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    lines.push(`<url><loc>${config.project.hosting_url}</loc></url>`);

    const articleDocs = await db.collection('articles').get();

    const userIds: string[] = articleDocs.docs.map(
      (article) => article.data().uid
    );
    const uniqueUserIds = Array.from(new Set(userIds));
    const userDocs: any[] = [];
    uniqueUserIds.forEach(async (uid) => {
      userDocs.push((await db.doc(`users/${uid}`).get()).data());
    });

    articleDocs.docs.map((article) => {
      lines.push(
        `<url><loc>${config.project.hosting_url}${userDocs.find(
          (user: UserData) => user.uid === article.data().uid
        )}/a/${article.data().articleId}</loc></url>`
      );
    });

    lines.push(`</urlset>`);

    res.set('Cache-Control', 'public, max-age=7200, s-maxage=600');
    res.set('Content-Type', 'text/xml');
    res.send(lines.join('\n'));
  } catch (error) {
    functions.logger.error(`Error occuered in sitemap: ${error}`, error);
    res.redirect('/sitemap.xml');
  }
});
