import { TestBed } from '@angular/core/testing';

import { TogglApiService } from './toggl-api.service';

describe('TogglApiService', () => {
  let service: TogglApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TogglApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
