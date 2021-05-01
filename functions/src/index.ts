import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
export {
  createUser,
  deleteUserData,
  deleteUserArticles,
} from './user.function';
export { createPost, deletePost, updatePost } from './article.function';
export { countUpLiked, countDownLiked } from './like.function';
export { render } from './render.function';
export { backup } from './backup.function';
export {
  tweetPickUpArticleFromBot,
  getTwitterProfile,
} from './twitter.function';
export { countUpArticleView } from './view-count.function';
export {
  createArticleRandomAndCountUp,
  deleteArticleRandomAndCountDown,
  updateArticleRandom,
} from './article-random.function';
export { addAdminClaim, removeAdminClaim } from './admin.function';
export { sitemap } from './sitemap.function';
