// vitest 移行中の jasmine 互換 shim 型宣言。
// 既存 spec が `jasmine.createSpy(...)` / `spyOn(...)` などを使えるようにする。
// 将来的に spec を vitest 標準 API (vi.fn / vi.spyOn) に書き換えたら本ファイル削除。

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function spyOn<T, K extends keyof T>(obj: T, method: K): JasmineSpy<any>;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jasmine {
    type SpyObj<T> = { [K in keyof T]: JasmineSpy } & Record<string, JasmineSpy>;
    type Spy = JasmineSpy;
  }

  const jasmine: {
    createSpy(name?: string, impl?: (...args: unknown[]) => unknown): JasmineSpy;
    createSpyObj<T = unknown>(
      name: string,
      methods: string[] | Record<string, unknown>
    ): { [K in keyof T]: JasmineSpy } & Record<string, JasmineSpy>;
    any(): unknown;
    anything(): unknown;
    objectContaining(obj: object): unknown;
    arrayContaining(arr: unknown[]): unknown;
    stringMatching(s: string | RegExp): unknown;
    clock(): {
      install(): void;
      uninstall(): void;
      tick(ms: number): void;
      mockDate(d: Date): void;
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface JasmineSpy<T extends (...args: any[]) => any = (...args: any[]) => any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]): any;
    and: {
      returnValue(v: unknown): JasmineSpy<T>;
      returnValues(...vs: unknown[]): JasmineSpy<T>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callFake(fn: (...args: any[]) => any): JasmineSpy<T>;
      callThrough(): JasmineSpy<T>;
      throwError(err: unknown): JasmineSpy<T>;
      resolveTo(v: unknown): JasmineSpy<T>;
      rejectWith(v: unknown): JasmineSpy<T>;
    };
    calls: {
      count(): number;
      reset(): void;
      argsFor(i: number): unknown[];
      mostRecent(): { args: unknown[] } | undefined;
      all(): { args: unknown[] }[];
    };
  }
}

export {};
