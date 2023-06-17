import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const config = functions.config();
const db = firestore();

const server = async (req: any, res: any) => {
  res.set('Cache-Control', 'public, max-age=259200, s-maxage=172800');
  res.set('Content-Type', 'text/xml');

  try {
    const lines = [];
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    lines.push(`<url><loc>${config.project.hosting_url}</loc></url>`);

    const articleDocs = await db
      .collection('articles')
      .where('isPublic', '==', true)
      .get();

    const userIds: string[] = articleDocs.docs.map(
      (article) => article.data().uid
    );
    const uniqueUserIds = Array.from(new Set(userIds));
    const userDocs = await Promise.all(
      uniqueUserIds.map(async (uid) => {
        return (await db.doc(`users/${uid}`).get()).data();
      })
    );

    articleDocs.docs.map((article) => {
      const userData = userDocs.find(
        (user) => user?.uid === article.data().uid
      );
      if (userData) {
        lines.push(
          `<url><loc>${config.project.hosting_url}${userData.screenName}/a/${
            article.data().articleId
          }</loc></url>`
        );
      }
      return;
    });
    lines.push(`</urlset>`);

    res.send(lines.join('\n'));
  } catch (error) {
    functions.logger.error(`Error occuered in sitemap: ${error}`, error);
    res.redirect('/sitemap.xml');
  }
};

export const sitemap = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .region('us-central1')
  .https.onRequest(server);
