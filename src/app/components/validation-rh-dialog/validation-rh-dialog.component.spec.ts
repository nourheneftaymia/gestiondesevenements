import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRhDialogComponent } from './validation-rh-dialog.component';

describe('ValidationRhDialogComponent', () => {
  let component: ValidationRhDialogComponent;
  let fixture: ComponentFixture<ValidationRhDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationRhDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationRhDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
