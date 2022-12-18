import { TestBed } from '@angular/core/testing';

import { BrowserFileSystemService } from './file-system.service';

describe('FileSystemService', () => {
  let service: BrowserFileSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserFileSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
