import { DocumentData } from '@google-cloud/firestore';

export function randomArticle(articles: DocumentData[]): DocumentData {
  const shuffledArticles = shuffleArticles(articles);
  const randomIndex = Math.floor(Math.random() * shuffledArticles.length);
  return shuffledArticles[randomIndex];
}
function shuffleArticles(articles: DocumentData[]): DocumentData[] {
  for (let i = articles.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[rand]] = [articles[rand], articles[i]];
  }
  return articles;
}

const emojiList = [
  '💡',
  '☀️',
  '🌸',
  '✨',
  '⚡️',
  '✏️',
  '👀',
  '🎵',
  '🎶',
  '🎹',
  '🎸',
];
export function randomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return emojiList[randomIndex];
}
