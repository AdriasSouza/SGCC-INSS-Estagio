import { TestBed } from '@angular/core/testing';

import { BasicLoginService } from './basic-login.service';

describe('BasicLoginService', () => {
  let service: BasicLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
