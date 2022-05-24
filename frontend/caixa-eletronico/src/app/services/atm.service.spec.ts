import { TestBed } from '@angular/core/testing';

import { AtmService } from './atm.service';

describe('AtmService', () => {
  let service: AtmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
