import { TestBed } from '@angular/core/testing';

import { QueryMergeService } from './query-merge.service';

describe('QueryMergeService', () => {
  let service: QueryMergeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryMergeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
