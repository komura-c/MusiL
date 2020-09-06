import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ArticleService } from 'src/app/services/article.service';
import { firestore } from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss']
})
export class PickupComponent implements OnInit {
  config: SwiperConfigInterface = {
    loop: false,
    navigation: true,
    mousewheel: true,
    centeredSlides: true,
    slidesPerView: 1,
    pagination: false,
    spaceBetween: 20,
    breakpoints: {
      480: {
        slidesPerView: 2
      },
      896: {
        slidesPerView: 3
      }
    }
  };
  activeSlide = 0;

  ramdamDateTimeStamp = firestore.Timestamp.fromDate(this.randomizeDate('2020/08/01'));
  articles$: Observable<ArticleWithAuthor[]> =
    this.articleService.getPickUpArticles(this.ramdamDateTimeStamp).pipe(
      map((articles) => {
        if (articles.length) {
          return this.shuffleArticle(articles);
        } else {
          return null;
        }
      })
    );

  constructor(
    private articleService: ArticleService
  ) { }

  ngOnInit(): void { }

  randomizeDate(fromYmd: string) {
    const fromDate = new Date(fromYmd);
    const today = new Date();
    return new Date(fromDate.getTime() + Math.random() * (today.getTime() - fromDate.getTime()));
  }

  shuffleArticle(articles: ArticleWithAuthor[]) {
    for (let i = articles.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[rand]] = [articles[rand], articles[i]];
    }
    return articles;
  }
}
