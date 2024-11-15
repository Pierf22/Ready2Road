import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAUserByAdminComponent } from './modify-a-user-by-admin.component';

describe('AddAUserByAdminComponent', () => {
  let component: ModifyAUserByAdminComponent;
  let fixture: ComponentFixture<ModifyAUserByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyAUserByAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAUserByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
