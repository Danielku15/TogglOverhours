import { TestBed } from '@angular/core/testing';

import { HasDatabaseOpenedGuardService } from './has-database-opened-guard.service';

describe('HasDatabaseOpenedGuardService', () => {
  let service: HasDatabaseOpenedGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HasDatabaseOpenedGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
