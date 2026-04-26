// @angular/build:unit-test (runner: vitest) は internal の `angular:test-bed-init`
// で TestBed/platformBrowserDynamicTesting を初期化する。ここでは providers の
// 追加と jasmine 互換 shim だけを担当する（initTestEnvironment は呼ばない）。
import 'zone.js';
import 'zone.js/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { expect, vi } from 'vitest';

// jsdom 未対応 API のスタブ
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe(): void {
      // noop
    }
    unobserve(): void {
      // noop
    }
    disconnect(): void {
      // noop
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    root: Element | null = null;
    rootMargin = '';
    thresholds: number[] = [];
  }
  (globalThis as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver =
    MockIntersectionObserver;
}

// vitest の expect を jasmine 風 matcher で拡張
expect.extend({
  toBeTrue(received: unknown) {
    return { pass: received === true, message: () => `expected ${received} to be true` };
  },
  toBeFalse(received: unknown) {
    return { pass: received === false, message: () => `expected ${received} to be false` };
  },
});

declare module 'vitest' {
  interface Assertion {
    toBeTrue(): void;
    toBeFalse(): void;
  }
}

// jasmine 互換 shim
type Spy = ReturnType<typeof vi.fn> & {
  and: Record<string, unknown>;
  calls: Record<string, unknown>;
};

function decorate(fn: ReturnType<typeof vi.fn>): Spy {
  const spy = fn as Spy;
  Object.defineProperty(spy, 'and', {
    value: {
      returnValue: (v: unknown) => {
        (spy as { mockReturnValue: (v: unknown) => unknown }).mockReturnValue(v);
        return spy;
      },
      returnValues: (...vs: unknown[]) => {
        const m = spy as { mockReturnValueOnce: (v: unknown) => unknown };
        vs.forEach((v) => m.mockReturnValueOnce(v));
        return spy;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callFake: (impl: (...args: any[]) => any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (spy as { mockImplementation: (f: (...a: any[]) => any) => unknown }).mockImplementation(impl);
        return spy;
      },
      callThrough: () => spy,
      throwError: (err: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (spy as { mockImplementation: (f: (...a: any[]) => any) => unknown }).mockImplementation(() => {
          throw err;
        });
        return spy;
      },
      resolveTo: (v: unknown) => {
        (spy as { mockResolvedValue: (v: unknown) => unknown }).mockResolvedValue(v);
        return spy;
      },
      rejectWith: (v: unknown) => {
        (spy as { mockRejectedValue: (v: unknown) => unknown }).mockRejectedValue(v);
        return spy;
      },
    },
    configurable: true,
  });
  Object.defineProperty(spy, 'calls', {
    value: {
      count: () => (spy as { mock: { calls: unknown[] } }).mock.calls.length,
      reset: () => (spy as { mockReset: () => unknown }).mockReset(),
      argsFor: (i: number) => (spy as { mock: { calls: unknown[][] } }).mock.calls[i] ?? [],
      mostRecent: () => {
        const calls = (spy as { mock: { calls: unknown[][] } }).mock.calls;
        return calls.length ? { args: calls[calls.length - 1] } : undefined;
      },
      all: () =>
        (spy as { mock: { calls: unknown[][] } }).mock.calls.map((args) => ({ args })),
    },
    configurable: true,
  });
  return spy;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeSpy(name?: string, impl?: (...args: any[]) => any): Spy {
  const fn = (impl ? vi.fn(impl) : vi.fn());
  if (name) {
    (fn as { mockName: (n: string) => unknown }).mockName(name);
  }
  return decorate(fn);
}

const jasmineGlobal = {
  createSpy: makeSpy,
  createSpyObj: (name: string, methods: string[] | Record<string, unknown>) => {
    const obj: Record<string, Spy> = {};
    if (Array.isArray(methods)) {
      methods.forEach((m) => (obj[m] = makeSpy(`${name}.${m}`)));
    } else {
      Object.entries(methods).forEach(([k, v]) => {
        obj[k] = makeSpy(`${name}.${k}`);
        (obj[k].and as { returnValue: (v: unknown) => unknown }).returnValue(v);
      });
    }
    return obj;
  },
  any: () => expect.any(Object),
  anything: () => expect.anything(),
  objectContaining: (obj: object) => expect.objectContaining(obj),
  arrayContaining: (arr: unknown[]) => expect.arrayContaining(arr),
  stringMatching: (s: string | RegExp) => expect.stringMatching(s),
  clock: () => ({
    install: () => vi.useFakeTimers(),
    uninstall: () => vi.useRealTimers(),
    tick: (ms: number) => vi.advanceTimersByTime(ms),
    mockDate: (d: Date) => vi.setSystemTime(d),
  }),
};

(globalThis as unknown as { jasmine: typeof jasmineGlobal }).jasmine = jasmineGlobal;

(globalThis as unknown as { spyOn: typeof globalSpyOn }).spyOn = globalSpyOn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function globalSpyOn<T, K extends keyof T>(obj: T, method: K): Spy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spy = vi.spyOn(obj as any, method as any) as unknown as ReturnType<typeof vi.fn>;
  return decorate(spy);
}

export default [provideZoneChangeDetection({ eventCoalescing: true })];
