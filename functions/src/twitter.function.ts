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
      await tweetFromBot();
      res.status(200).send('Tweet Success');
      return;
    }
    res.status(404).send("Forbidden you don't have permission");
  });

async function tweetFromBot() {
  const articlesQuerySnapshot = await db
    .collection(`articles`)
    .where('isPublic', '==', true)
    .get();
  if (articlesQuerySnapshot) {
    const articles: DocumentData[] = [];
    articlesQuerySnapshot.forEach((articleQuerySnapshot) => {
      functions.logger.info(articleQuerySnapshot.data());
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
): Promise<boolean> {
  const tweetText =
    randomEmoji() +
    'ピックアップ' +
    '\n' +
    articleData.title +
    '\n' +
    config.project.hosting_url +
    articleData.screenName +
    '/a/' +
    articleData.articleId;
  await twitterClient
    .post('statuses/update', {
      status: tweetText,
    })
    .then((tweetData) => {
      functions.logger.info('Tweet Success');
      functions.logger.info(tweetData);
    })
    .catch((error) => {
      throw error;
    });
  return true;
}

const emojiList = ['💡', '☀️', '⛏', '🌸', '✨', '⚡️', '✏️'];
function randomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return emojiList[randomIndex];
}
