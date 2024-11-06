import { TestBed } from '@angular/core/testing';

import { TipoComponenteService } from './tipo-componente.service';

describe('TipoComponenteService', () => {
  let service: TipoComponenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoComponenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
