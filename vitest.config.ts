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
      exclude: [
        '**/*.d.ts',
        'src/test-setup.ts',
        'src/test/**',
        'src/main.ts',
        'src/environments/**',
        'src/**/*.spec.ts',
        'src/app/app.routes.ts',
        'src/app/app.config.ts',
        // Firebase ラッパー: モジュール関数の薄いラッパーで、firebase JS SDK の
        // モック化が他 spec と競合しやすいため統合テストで担保（カバレッジ対象外）
        'src/app/services/firebase.service.ts',
      ],
      // 閾値はカバレッジ充実フェーズで設定（Stage 4）
    },
  },
});
