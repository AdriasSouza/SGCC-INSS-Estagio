import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEquipamentoComponent } from './tipo-equipamento.component';

describe('TipoEquipamentoComponent', () => {
  let component: TipoEquipamentoComponent;
  let fixture: ComponentFixture<TipoEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEquipamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
