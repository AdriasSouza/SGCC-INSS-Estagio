import { TestBed } from '@angular/core/testing';

import { ComponeteService } from './componete.service';

describe('ComponeteService', () => {
  let service: ComponeteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponeteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
