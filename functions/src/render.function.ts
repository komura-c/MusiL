import * as functions from 'firebase-functions';
import * as express from 'express';
import * as useragent from 'express-useragent';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin'
const xss = require("xss");

const db = admin.firestore();
// コピーされたindex.htmlの中身を取得
const file = readFileSync(resolve(__dirname, '../lib/index.html'), {
  encoding: 'utf-8',
});

// 置換関数
const buildHtml = (articleAndScreenName: { [key: string]: string }) => {
  const title = xss(articleAndScreenName.title);
  const htmlToTextReg = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
  const description = xss(articleAndScreenName.text?.replace(htmlToTextReg, '').substr(0, 200));
  const ogURL = xss('https://dtmplace-ad671.web.app/' + articleAndScreenName.screenName + '/n/' + articleAndScreenName.articleId);
  const ogImage = xss(articleAndScreenName.thumbnailURL ? articleAndScreenName.thumbnailURL : 'https://dtmplace-ad671.web.app/assets/images/ogp-cover.png');
  return file
    .replace(/\<title>.*<\/title>/g, '<title>' + title + '</title>')
    .replace(
      /<meta name="description" content="[^>]*>/g,
      '<meta name="description" content="' + description + '" />'
    )
    .replace(
      /<meta property="og:title" content="[^>]*>/g,
      '<meta property="og:title" content="' + title + '" />'
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

// expressアプリ初期化
const app = express();

// ユーザーエージェント判定ヘルパーを導入
app.use(useragent.express());

app.get('/:screenName/n/:articleId', async (req: any, res: any) => {
  // ロボットであれば置換結果を返却
  if (req.useragent.isBot) {
    // https://xxx/:screenName/n/:articleId のようなURLを元に記事データをDBから取得
    const article = (await db.doc(`articles/${req.params.articleId}`).get())?.data();
    if (article) {
      const articleAndScreenName = {
        ...article,
        screenName: req.params.screenName,
      };
      // 結果を返却
      res.send(buildHtml(articleAndScreenName));
      return;
    }
  }
  // ロボットでなければ置換せずindex.htmlを返却
  res.send(file);
});

// 関数を定義
export const render = functions.region('asia-northeast1').https.onRequest(app);
