import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import algoliasearch, { SearchIndex } from 'algoliasearch';

const config = functions.config();
const client = algoliasearch(config.algolia.app_id, config.algolia.secret_key);

export class Algolia {
  private maxContentLength = 500;

  /**
   * データ内のTimestampや日付型をミリ秒に変換する
   *
   * @param data 変換データ
   */
  private transformDate(data: any) {
    return Object.entries(data).reduce((obj, [key, value]) => {
      if (value instanceof admin.firestore.Timestamp) {
        obj[key] = value.toMillis();
      }
      return obj;
    }, data);
  }

  /**
   * 巨大なデータを分割してレコードに追加
   *
   * @param index インデックス名
   * @param data 追加するデータ
   * @param idKey IDが含まれるキー名(デフォルトは'id')
   * @param largeConcentKey 巨大なデータが含まれるキー名
   */
  private addDistributedRecords(
    index: SearchIndex,
    data: any,
    isKey: string,
    largeConcentKey: string,
  ) {
    const reg = new RegExp(`[\\s\\S]{1,${this.maxContentLength}}`, 'gm');
    const records = data[largeConcentKey]
      .match(reg)
      .map((largeData: any, i: number) => {
        return {
          ...data,
          objectID: data[isKey] + '-' + i,
          [largeConcentKey]: largeData,
        };
      });

    return Promise.all(records.map((record: any) => index.saveObject(record)));
  }

  /**
   * レコードを追加（更新）
   *
   * @param param.indexName レコード名
   * @param param.data 追加するデータ
   * @param param.isUpdate 追加(false) or 更新(true)
   * @param param.idKey idのキー名(デフォルトは'id')
   * @param param.largeConcentKey 巨大なデータが含まれるキー名
   */
  async saveRecord(param: {
    indexName: string;
    data: any;
    isUpdate?: boolean;
    idKey?: string;
    largeConcentKey?: string;
  }) {
    const index = client.initIndex(param.indexName);
    const item = this.transformDate(param.data);
    const idKey = param.idKey || 'id';

    if (param.isUpdate) {
      await this.removeRecord(param.indexName, item[idKey]);
    }

    if (
      param.largeConcentKey &&
      item[param.largeConcentKey] &&
      item[param.largeConcentKey].length > this.maxContentLength
    ) {
      return this.addDistributedRecords(
        index,
        item,
        idKey,
        param.largeConcentKey,
      );
    } else {
      item.objectID = item[idKey];
      return index.saveObject(item);
    }
  }

  /**
   * レコードを削除
   *
   * @param indexName 削除対象のインデックス名
   * @param id 削除対象のid
   * @param idKey idのキー名(デフォルトは'id')
   */
  removeRecord(indexName: string, id: string, idKey: string = 'articleId') {
    const index = client.initIndex(indexName);
    return index.deleteBy({ filters: `${idKey}:${id}` });
  }
}
