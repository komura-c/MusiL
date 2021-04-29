import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';
import { htmlToText } from 'html-to-text';

const config = functions.config();
const db = admin.firestore();

const file = readFileSync(resolve(__dirname, 'index.html'), {
  encoding: 'utf-8',
});

const buildHtml = (articleAndScreenName: { [key: string]: string }) => {
  const title = articleAndScreenName.title;
  const description = htmlToText(articleAndScreenName.text)
    .replace(/\n/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(
      /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
      '',
    )
    .slice(0, 120);
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
      '<meta name="description" content="' + description + '" />',
    )
    .replace(
      /<meta property="og:title" content="[^>]*>/g,
      '<meta property="og:title" content="' + title + ' | MusiL" />',
    )
    .replace(
      /<meta property="og:description" content="[^>]*>/g,
      '<meta property="og:description" content="' + description + '" />',
    )
    .replace(
      /<meta property="og:type" content="[^>]*>/g,
      '<meta property="og:type" content="article" />',
    )
    .replace(
      /<meta property="og:url" content="[^>]*>/g,
      '<meta property="og:url" content="' + ogURL + '" />',
    )
    .replace(
      /<meta property="og:image" content="[^>]*>/g,
      '<meta property="og:image" content="' + ogImage + '" />',
    );
};

const server = async (req: any, res: any) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const userAgent: string = req.headers['user-agent'].toLowerCase();
  const isBot: boolean =
    userAgent.includes('googlebot') ||
    userAgent.includes('developers.google.com')
      ? true
      : false ||
        userAgent.includes('twitterbot') ||
        userAgent.includes('facebookexternalhit') ||
        userAgent.includes('yahoou') ||
        userAgent.includes('bingbot') ||
        userAgent.includes('baiduspider') ||
        userAgent.includes('yandex') ||
        userAgent.includes('yeti') ||
        userAgent.includes('yodaobot') ||
        userAgent.includes('gigabot') ||
        userAgent.includes('ia_archiver');
  if (!isBot) {
    return res.status(200).send(file);
  }
  if (isBot) {
    const path = req.params[0].split('/');
    const screenName = path[path.length - 3];
    const articleId = path[path.length - 1];
    try {
      const article = (await db.doc(`articles/${articleId}`).get())?.data();
      if (!article) {
        return res.status(404).send(file);
      }
      if (article) {
        const articleAndScreenName = {
          ...article,
          screenName,
        };
        return res.status(200).send(buildHtml(articleAndScreenName));
      }
      return res.status(200).send(file);
    } catch (error) {
      functions.logger.error(error);
      return res.status(404).send(file);
    }
  }
  return res.status(200).send(file);
};

export const render = functions.https.onRequest(server);
