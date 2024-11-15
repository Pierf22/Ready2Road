import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracciamentoComponent } from './tracciamento.component';

describe('TracciamentoComponent', () => {
  let component: TracciamentoComponent;
  let fixture: ComponentFixture<TracciamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracciamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TracciamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
