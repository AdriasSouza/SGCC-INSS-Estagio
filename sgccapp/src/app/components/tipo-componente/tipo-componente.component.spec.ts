import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoComponenteComponent } from './tipo-componente.component';

describe('TipoComponenteComponent', () => {
  let component: TipoComponenteComponent;
  let fixture: ComponentFixture<TipoComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoComponenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
