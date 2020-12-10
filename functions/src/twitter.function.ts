import * as functions from 'firebase-functions';
import * as Twitter from 'twitter';
import * as admin from 'firebase-admin';
import { DocumentData } from '@google-cloud/firestore';

const config = functions.config();
const db = admin.firestore();

export const tweetPickUpArticleFromBot = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    if (req.query.access_token_key === config.twitter_bot.access_token_key) {
      const resultData = await tweetFromBot();
      return res.status(200).send(resultData);
    }
    res.status(404).send("Forbidden you don't have permission");
  });

async function tweetFromBot(): Promise<Twitter.ResponseData> {
  const articlesQuerySnapshot = await db
    .collection(`articles`)
    .where('isPublic', '==', true)
    .get();
  if (articlesQuerySnapshot) {
    const articles: DocumentData[] = [];
    articlesQuerySnapshot.forEach((articleQuerySnapshot) => {
      articles.push(articleQuerySnapshot.data());
    });
    const twitterClient = new Twitter({
      consumer_key: config.twitter_bot.consumer_key,
      consumer_secret: config.twitter_bot.consumer_secret,
      access_token_key: config.twitter_bot.access_token_key,
      access_token_secret: config.twitter_bot.access_token_secret,
    });
    return await tweet(twitterClient, shuffleArticles(articles)[0]);
  } else {
    throw new Error('記事データの取得に失敗しました');
  }
}

function shuffleArticles(articles: DocumentData[]): DocumentData[] {
  for (let i = articles.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[rand]] = [articles[rand], articles[i]];
  }
  return articles;
}

async function tweet(
  twitterClient: Twitter,
  articleData: DocumentData
): Promise<Twitter.ResponseData> {
  const tweetText =
    randomEmoji() +
    'ピックアップ' +
    '\n' +
    '\n' +
    articleData.title +
    ' @' +
    articleData.screenName +
    '\n' +
    config.project.hosting_url +
    articleData.screenName +
    '/a/' +
    articleData.articleId;
  return await twitterClient
    .post('statuses/update', {
      status: tweetText,
    })
    .then((tweetData) => {
      return tweetData;
    })
    .catch((error) => {
      throw error;
    });
}

const emojiList = ['💡', '☀️', '⛏', '🌸', '✨', '⚡️', '✏️'];
function randomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return emojiList[randomIndex];
}
