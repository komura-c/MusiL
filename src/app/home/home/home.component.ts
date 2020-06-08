import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces/article';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  articles: Article[] = [
    {
      userId: 'u00001',
      id: 'a00001',
      thumbnailUrl: 'https://placehold.it/80x80',
      title: 'Sylenth1の音作り',
      tag: 'Sylenth1',
      text: 'Sylenth1はLennarDigital社から発売されているソフトシンセ音源で',
    },
    {
      userId: 'u00002',
      id: 'a00002',
      thumbnailUrl: 'https://placehold.it/80x80',
      title: 'Nexus3の個人的使い方',
      tag: 'Nexus3',
      text: 'Nexus3はreFX社から発売されているサンプラーベースの音源で',
    },
    {
      userId: 'u00001',
      id: 'a00003',
      thumbnailUrl: 'https://placehold.it/80x80',
      title: 'DTM00001',
      tag: 'Sylenth1',
      text: '使い方はこの通り',
    },
    {
      userId: 'u00003',
      id: 'a00004',
      thumbnailUrl: 'https://placehold.it/80x80',
      title: 'DTM00002',
      tag: 'Sylenth1',
      text: '使い方はこの通り',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
}
