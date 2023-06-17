import * as functions from 'firebase-functions';
import Twitter from 'twitter';
import * as admin from 'firebase-admin';
import { DocumentData } from '@google-cloud/firestore';
import { randomEmoji, randomArticle } from './utils/random.util';

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
    const articleData = randomArticle(articles);
    const userData = (await db.doc(`users/${articleData.uid}`).get())?.data();
    const tweetText = createTweetText(articleData, userData);
    return await tweet(twitterClient, tweetText);
  } else {
    throw new Error('記事データの取得に失敗しました');
  }
}

function createTweetText(
  articleData: DocumentData,
  userData: DocumentData | undefined
): string {
  if (articleData && userData) {
    return (
      randomEmoji() +
      articleData.title +
      ' by ' +
      userData.screenName +
      '\n' +
      config.project.hosting_url +
      userData.screenName +
      '/a/' +
      articleData.articleId
    );
  } else {
    return randomEmoji();
  }
}

async function tweet(
  twitterClient: Twitter,
  tweetText: string
): Promise<Twitter.ResponseData> {
  return await twitterClient
    .post('statuses/update', {
      status: tweetText,
    })
    .then((tweetData) => {
      return tweetData;
    })
    .catch((error) => {
      return error;
    });
}

export const getTwitterProfile = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data: { access_token_key: string; screen_name: string }) => {
      if (data.access_token_key === config.twitter_bot.access_token_key) {
        const twitterClient = new Twitter({
          consumer_key: config.twitter_bot.consumer_key,
          consumer_secret: config.twitter_bot.consumer_secret,
          access_token_key: config.twitter_bot.access_token_key,
          access_token_secret: config.twitter_bot.access_token_secret,
        });
        return await twitterClient
          .get('users/show', {
            screen_name: data.screen_name,
          })
          .then((tweetData) => {
            return tweetData;
          })
          .catch((error) => {
            return error;
          });
      }
      return "Forbidden you don't have permission";
    }
  );
