import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { firestore } from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
})
export class PickupComponent implements OnInit {
  swiperConfig: SwiperOptions = {
    allowTouchMove: true,
    navigation: {
      nextEl: '.swiper__arrow--next',
      prevEl: '.swiper__arrow--prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      480: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      896: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    },
  };

  ramdamDateTimeStamp = firestore.Timestamp.fromDate(
    this.randomizeDate('2020/08/01')
  );
  articles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getPickUpArticles(this.ramdamDateTimeStamp).pipe(
    map((articles) => {
      if (articles?.length) {
        return this.shuffleArticle(articles);
      } else {
        return null;
      }
    })
  );

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void { }

  randomizeDate(fromYmd: string) {
    const fromDate = new Date(fromYmd);
    const today = new Date();
    return new Date(
      fromDate.getTime() +
      Math.random() * (today.getTime() - fromDate.getTime())
    );
  }

  shuffleArticle(articles: ArticleWithAuthor[]) {
    for (let i = articles.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[rand]] = [articles[rand], articles[i]];
    }
    return articles;
  }
}
