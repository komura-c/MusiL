import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class MatPaginatorIntlJaModule extends MatPaginatorIntl {
  override itemsPerPageLabel = '1 ページの記事数： ';
  override nextPageLabel = '次のページ';
  override previousPageLabel = '前のページ';
  override lastPageLabel = '最後のページ';
  override firstPageLabel = '最初のページ';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
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
  };
}
