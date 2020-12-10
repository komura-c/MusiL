import * as functions from 'firebase-functions';
import * as express from 'express';
import * as useragent from 'express-useragent';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';
const htmlToText = require('html-to-text');

const config = functions.config();
const db = admin.firestore();

const file = readFileSync(resolve(__dirname, 'index.html'), {
  encoding: 'utf-8',
});

const buildHtml = (articleAndScreenName: { [key: string]: string }) => {
  const title = articleAndScreenName.title;
  const description = htmlToText
    .fromString(articleAndScreenName.text ? articleAndScreenName.text : '')
    .replace(
      /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
      ''
    );
  const ogURL =
    config.project.hosting_url +
    articleAndScreenName.screenName +
    '/a/' +
    articleAndScreenName.articleId;
  const ogImage = articleAndScreenName.thumbnailURL
    ? articleAndScreenName.thumbnailURL
    : config.project.hosting_url + 'assets/images/ogp-cover.png';
  return file
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

const app = express();
app.use(useragent.express());
app.get('/:screenName/a/:articleId', async (req: any, res: any) => {
  if (req.useragent.isBot) {
    const article = (
      await db.doc(`articles/${req.params.articleId}`).get()
    )?.data();
    if (article) {
      const articleAndScreenName = {
        ...article,
        screenName: req.params.screenName,
      };
      res.send(buildHtml(articleAndScreenName));
      return;
    }
  }
  res.send(file);
});

export const render = functions.https.onRequest(app);
