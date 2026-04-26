import { defineConfig } from 'vitest/config';

// 注: Angular の build target (musil:build) を経由して spec をビルドするため、
// テスト実行は `pnpm test` (ng test) 経由で行うのが正規ルート。
// このファイルは coverage 設定のために存在（angular.json の test builder が参照する）。
export default defineConfig({
  test: {
    globals: true,
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
      ],
      // 閾値はカバレッジ充実フェーズで設定（Stage 4）
    },
  },
});
