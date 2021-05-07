import * as express from 'express';
import * as useragent from 'express-useragent';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { htmlToText } from 'html-to-text';

import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

export const app = (): express.Express => {
  const server = express();
  const indexHtml = readFileSync(resolve(__dirname, 'index.html'), {
    encoding: 'utf-8',
  });

  server.use(useragent.express());
  server.get('/:screenName/a/:articleId', (req, res) => {
    console.log(req.params);
    res.set('Cache-Control', 'public, max-age=7200, s-maxage=600');
    if (!req.useragent.isBot) {
      return res.status(200).send(indexHtml);
    }
    db.doc(`articles/${req.params.articleId}`).get()
      .then((docs) => {
        const articleAndScreenName: { [key: string]: string } = {
          ...docs.data(),
          screenName: req.params.screenName,
        };
        return res.status(200).send(buildHtml(indexHtml, articleAndScreenName));
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).send('サーバー側でデータを取得できませんでした');
      })
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.status(200).send(indexHtml);
  });
  return server;
}

if (process.env.NODE_ENV !== 'production') {
  const run = () => {
    const port = process.env.PORT || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }
  run();
}

const buildHtml = (indexHtml: string, articleAndScreenName: { [key: string]: string }) => {
  const hostingURL = process.env.URL || 'https://dtmplace-ad671.web.app/';
  const title = articleAndScreenName.title;
  const description = htmlToText(articleAndScreenName.text).replace(
    /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
    ''
  );
  const ogURL =
    hostingURL +
    articleAndScreenName.screenName +
    '/a/' +
    articleAndScreenName.articleId;
  const ogImage = articleAndScreenName.thumbnailURL
    ? articleAndScreenName.thumbnailURL
    : hostingURL + 'assets/images/ogp-cover.png';
  return indexHtml
    .replace(/\n/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/\<title>.*<\/title>/g, '<title>' + title + ' | MusiL</title>')
    .replace(
      /<meta name="description" content="[^>]*>/g,
      '<meta name="description" content="' + description + '" />'
    )
    .replace(
      /<meta property="og:title" content="[^>]*>/g,
      '<meta property="og:title" content="' + title + ' | MusiL" />'
    )
    .replace(
      /<meta property="og:description" content="[^>]*>/g,
      '<meta property="og:description" content="' + description + '" />'
    )
    .replace(
      /<meta property="og:type" content="[^>]*>/g,
      '<meta property="og:type" content="article" />'
    )
    .replace(
      /<meta property="og:url" content="[^>]*>/g,
      '<meta property="og:url" content="' + ogURL + '" />'
    )
    .replace(
      /<meta property="og:image" content="[^>]*>/g,
      '<meta property="og:image" content="' + ogImage + '" />'
    );
};
