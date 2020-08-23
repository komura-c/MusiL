import * as functions from 'firebase-functions';
import * as express from 'express';
import * as useragent from 'express-useragent';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin'

const db = admin.firestore();
// コピーされたindex.htmlの中身を取得
const file = readFileSync(resolve(__dirname, '../lib/index.html'), {
  encoding: 'utf-8',
});

// 置換ヘルパー
const replacer = (data: string) => {
  return (match: string, content: string): string => {
    return match.replace(content, data);
  };
};

// 置換関数
const buildHtml = (article: { [key: string]: string }, user: FirebaseFirestore.DocumentData | undefined) => {
  const html2textReg = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
  return file
    // descriptionを記事本文の先頭200文字に置換
    .replace(
      /<meta name="description" content="(.+)" \/>/gm,
      replacer(article.text?.replace(html2textReg, '').substr(0, 200))
    )
    // OGP画像を記事のサムネイルURLに置換
    .replace(/content="(.+ogp-cover.png)"/gm, replacer(article.thumbnailURL ? article.thumbnailURL : 'https://dtmplace-ad671.web.app/assets/images/ogp-cover.png'))
    // タイトルを記事タイトルに置換
    .replace(/<title>(.+)<\/title>"/gm, replacer(article.title))
    // OGタイトルを記事タイトルに置換
    .replace(
      /<meta property="og:title" content="(.+)" \/>"/gm,
      replacer(article.title)
    )
    // OG:URLを記事URLに置換
    .replace(/<meta property="og:url" content="(.+)" \/>/g, replacer('https://dtmplace-ad671.web.app/' + user?.screenName + '/n/' + article.articleId));
};

// expressアプリ初期化
const app = express();

// ユーザーエージェント判定ヘルパーを導入
app.use(useragent.express());

app.get(':id/n/:id', async (req: any, res: any) => {
  // ロボットであれば置換結果を返却
  if (req.useragent.isBot) {
    // https://xxx/:id/n/:id のようなURLを元に記事データをDBから取得
    const article = (await db.doc(`articles/${req.query.id}`).get())?.data();
    const user = (await db.doc(`users/${article?.uid}`).get())?.data();
    if (article) {
      // 結果を返却
      res.send(buildHtml(article, user));
      return;
    }
  }
  // ロボットでなければ置換せずindex.htmlを返却
  res.send(file);
});

// 関数を定義
export const render = functions.region('asia-northeast1').https.onRequest(app);
