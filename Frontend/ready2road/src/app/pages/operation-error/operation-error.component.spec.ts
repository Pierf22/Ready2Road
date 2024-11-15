import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationErrorComponent } from './operation-error.component';

describe('OperationErrorComponent', () => {
  let component: OperationErrorComponent;
  let fixture: ComponentFixture<OperationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
