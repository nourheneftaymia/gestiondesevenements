import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsValidationRhDialogComponent } from './details-validation-rh-dialog.component';

describe('DetailsValidationRhDialogComponent', () => {
  let component: DetailsValidationRhDialogComponent;
  let fixture: ComponentFixture<DetailsValidationRhDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsValidationRhDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsValidationRhDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
