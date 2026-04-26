import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { FormGuard } from './form.guard';
import { WindowService } from '../services/window.service';

describe('FormGuard', () => {
  let guard: FormGuard;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let win: any;

  beforeEach(() => {
    win = { confirm: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: WindowService, useValue: win }],
    });
    guard = TestBed.inject(FormGuard);
  });

  function comp(pristine: boolean, isComplete: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { form: { pristine }, isComplete } as any;
  }

  it('returns true when form is pristine', () => {
    const result = guard.canDeactivate(comp(true, false));
    expect(result).toBe(true);
  });

  it('returns true when form is complete', () => {
    const result = guard.canDeactivate(comp(false, true));
    expect(result).toBe(true);
  });

  it('returns confirm result when dirty and incomplete', async () => {
    win.confirm.mockReturnValueOnce(true);
    const result = guard.canDeactivate(comp(false, false));
    const value = typeof result === 'boolean' ? result : await firstValueFrom(result);
    expect(value).toBe(true);
  });

  it('returns false when user cancels', async () => {
    win.confirm.mockReturnValueOnce(false);
    const result = guard.canDeactivate(comp(false, false));
    const value = typeof result === 'boolean' ? result : await firstValueFrom(result);
    expect(value).toBe(false);
  });
});
