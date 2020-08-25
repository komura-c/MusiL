import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MatPaginatorIntlJaModule extends MatPaginatorIntl {
  itemsPerPageLabel = '1 ページの記事数： ';
  nextPageLabel = '次のページ';
  previousPageLabel = '前のページ';
  lastPageLabel = '最後のページ';
  firstPageLabel = '最初のページ';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / 合計 ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} ～ ${endIndex} / 合計 ${length}`;
  }
}
