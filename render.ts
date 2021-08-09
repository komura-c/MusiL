import { htmlToText } from 'html-to-text';
import * as admin from 'firebase-admin';

if (process.env.NODE_ENV = 'production') {
  admin.initializeApp();
} else if (process.env.NODE_ENV = 'development') {
  // ts-node-dev set NODE_ENV to 'development' by default
  const environment = require('./src/environments/environment.ts');
  // export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    ...environment.firebase
  });
}
const db = admin.firestore();
const hostingURL = 'https://musil.place';

// const file = readFileSync(resolve(__dirname, 'index.html'), {
//   encoding: 'utf-8',
// });

const render = async (req: any, res: any, file: any) => {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=1500');
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
    const screenName = req.params.screenName;
    const articleId = req.params.articleId;
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
        return res.status(200).send(buildHtml(file, articleAndScreenName));
      }
      return res.status(200).send(file);
    } catch (error) {
      console.error(error);
      return res.status(404).send(file);
    }
  }
  return res.status(200).send(file);
};

export default render;

const buildHtml = (file: string, articleAndScreenName: { [key: string]: string }) => {
  const title = articleAndScreenName.title;
  const description = htmlToText(articleAndScreenName.text)
    .replace(/\n/g, '')
    .replace(/ /g, '')
    .replace(
      /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
      '',
    );
  const ogURL =
    hostingURL +
    articleAndScreenName.screenName +
    '/a/' +
    articleAndScreenName.articleId;
  const ogImage = articleAndScreenName.thumbnailURL
    ? articleAndScreenName.thumbnailURL
    : hostingURL + 'assets/images/ogp-cover.png';
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
