import { Injectable } from '@angular/core';
import { Article } from '@interfaces/article';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserData } from '@interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class OgpService {
  canvasWidth = 1200;
  canvasHeight = 630;
  backgroundImagePath = '/assets/ogp/base.png';
  userNameColor = '#424242';
  userNameSize = 40;
  userNameLineMargin = 12;
  userNameMarginX = 180;
  userNameHeight = 200;
  titleColor = '#424242';
  titleWeight = 'bold';
  titleSize = 60;
  titleLineMargin = 12;
  titleMarginX = 240;
  fontFamily = '"Noto Sans JP", sans-serif';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async createOgpImageAndUpload(
    title: string,
    articleId: string,
    user: UserData
  ) {
    if (title && articleId && user?.userName) {
      const ogpImage = await this.createOgp(title, user.userName);
      const thumbnailURL = await this.uploadOgp(articleId, ogpImage);
      return this.db
        .doc<Article>(`articles/${articleId}`)
        .update({ thumbnailURL });
    }
  }

  async createOgp(title: string, userName: string): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const context = canvas.getContext('2d');

    // 背景画像の描画
    const backgroundImage: any = await this.loadImage(this.backgroundImagePath);
    context.drawImage(
      backgroundImage,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );

    // ユーザー名の描画
    context.font = this.userNameSize + 'px ' + this.fontFamily;
    context.fillStyle = this.userNameColor;
    const userNameLines = this.splitByMeasureWidth(
      userName,
      this.canvasWidth - this.userNameMarginX,
      context
    );
    let userNamelineY =
      this.userNameHeight / 2 -
      ((this.userNameSize + this.userNameLineMargin) / 2) *
        (userNameLines.length - 1);
    userNameLines.forEach((line) => {
      const textWidth = context.measureText(line).width;
      context.fillText(line, (this.canvasWidth - textWidth) / 2, userNamelineY);
      userNamelineY += this.userNameSize + this.userNameLineMargin;
    });

    // タイトル文字の描画
    context.font =
      this.titleWeight + ' ' + this.titleSize + 'px ' + this.fontFamily;
    context.fillStyle = this.titleColor;
    const titleLines = this.splitByMeasureWidth(
      title,
      this.canvasWidth - this.titleMarginX,
      context
    );
    let titlelineY =
      this.canvasHeight / 2 -
      ((this.titleSize + this.titleLineMargin) / 2) * (titleLines.length - 1);
    titleLines.forEach((line) => {
      const textWidth = context.measureText(line).width;
      context.fillText(line, (this.canvasWidth - textWidth) / 2, titlelineY);
      titlelineY += this.titleSize + this.titleLineMargin;
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

  splitByMeasureWidth(
    str: string,
    maxWidth: number,
    context: CanvasRenderingContext2D
  ): string[] {
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
      .ref(`articles/${articleId}.png`)
      .putString(ogpImage, 'data_url');
    return await result.ref.getDownloadURL();
  }

  async deleteOgp(articleId: string) {
    return this.storage.ref(`articles/${articleId}.png`).delete();
  }
}
