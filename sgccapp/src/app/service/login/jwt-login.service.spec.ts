import { TestBed } from '@angular/core/testing';

import { JwtLoginService } from './jwt-login.service';

describe('JwtLoginService', () => {
  let service: JwtLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
