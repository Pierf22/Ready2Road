import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminicondizioniComponent } from './terminicondizioni.component';

describe('TerminicondizioniComponent', () => {
  let component: TerminicondizioniComponent;
  let fixture: ComponentFixture<TerminicondizioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminicondizioniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerminicondizioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
