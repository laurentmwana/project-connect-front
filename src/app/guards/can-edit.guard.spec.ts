import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canEditGuard } from './can-edit.guard';

describe('canEditGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
