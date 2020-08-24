import { Injectable } from '@angular/core';
import { Article } from '@interfaces/article';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class OgpService {
  canvasWidth = 1200;
  canvasHeight = 630;
  backgroundImagePath = '/assets/ogp/base.png';
  titleColor = '#424242';
  titleSize = 60;
  titleLineMargin = 16;
  titleMarginX = 240;
  textAreaHeight = 500;
  fontFamily = '"Noto Sans JP", sans-serif';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  async createOgpImageAndUpload(article: Omit<Article, 'createdAt' | 'likeCount'>) {
    if (article.title && article.articleId) {
      const ogpImage = await this.createOgp(article.title);
      const thumbnailURL = await this.uploadOgp(article.articleId, ogpImage);
      return this.db.doc<Article>(`articles/${article.articleId}`).update({ thumbnailURL });
    }
    return;
  }

  async createOgp(title: string): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const context = canvas.getContext('2d');

    // 背景画像の描画
    const backgroundImage: any = await this.loadImage(this.backgroundImagePath);
    context.drawImage(backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);

    // 文字の描画
    context.font = this.titleSize + 'px ' + this.fontFamily;
    context.fillStyle = this.titleColor;
    const titleLines: string[] = this.splitByMeasureWidth(title, this.canvasWidth - this.titleMarginX, context);
    let lineY: number = this.textAreaHeight / 2 - (this.titleSize + this.titleLineMargin) / 2 * (titleLines.length - 1);
    titleLines.forEach((line: string) => {
      const textWidth: number = context.measureText(line).width;
      context.fillText(line, (this.canvasWidth - textWidth) / 2, lineY);
      lineY += this.titleSize + this.titleLineMargin;
    });
    return canvas.toDataURL('image/png');
  }

  loadImage(srcURL: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = srcURL;
    });
  }

  splitByMeasureWidth(str: string, maxWidth: number, context: CanvasRenderingContext2D): string[] {
    const lines: string[] = [];
    let line = '';
    str.split('').forEach((char) => {
      line += char;
      if (context.measureText(line).width > maxWidth) {
        lines.push(line.slice(0, -1));
        line = line.slice(-1);
      }
    });
    lines.push(line);
    return lines;
  }

  async uploadOgp(articleId: string, ogpImage: string): Promise<string> {
    const result = await this.storage
      .ref(`articles/${articleId}`)
      .putString(ogpImage, 'data_url');
    return await result.ref.getDownloadURL();
  }

  async deleteOgp(articleId: string) {
    return this.storage.ref(`articles/${articleId}`).delete();
  }
}

