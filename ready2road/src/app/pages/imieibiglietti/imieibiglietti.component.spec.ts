import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImieibigliettiComponent } from './imieibiglietti.component';

describe('ImieibigliettiComponent', () => {
  let component: ImieibigliettiComponent;
  let fixture: ComponentFixture<ImieibigliettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImieibigliettiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImieibigliettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
