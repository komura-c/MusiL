import { defineConfig } from 'vitest/config';

// 注: Angular の build target (musil:build) を経由して spec をビルドするため、
// テスト実行は `pnpm test` (ng test) 経由で行うのが正規ルート。
// このファイルは coverage 設定のために存在（angular.json の test builder が参照する）。
export default defineConfig({
  test: {
    globals: true,
    // Angular の platform (initTestEnvironment) は単一プロセスで一度しか初期化できない
    // ため、worker 並列を抑えて単一プロセス + シーケンシャル実行にする。
    pool: 'threads',
    poolOptions: {
      threads: { singleThread: true },
    },
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // ロジック層 (services / pipes / guards / directives / lib) のみを
      // カバレッジ対象とする。components / pages はテンプレートと外部依存
      // (Material / Quill / Firebase) が支配的でユニットテスト ROI が低い
      // ため、機能確認用 spec は維持しつつカバレッジメトリクスからは除外。
      include: [
        'src/app/services/**/*.ts',
        'src/app/pipes/**/*.ts',
        'src/app/guards/**/*.ts',
        'src/app/directives/**/*.ts',
        'src/app/lib/**/*.ts',
      ],
      exclude: [
        '**/*.d.ts',
        'src/**/*.spec.ts',
        // Firebase ラッパー: モジュール関数の薄いラッパーで、firebase JS SDK の
        // モック化が他 spec と競合しやすいため統合テストで担保（対象外）
        'src/app/services/firebase.service.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
});
