import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEVFinalDialogComponent } from './create-evfinal-dialog.component';

describe('CreateEVFinalDialogComponent', () => {
  let component: CreateEVFinalDialogComponent;
  let fixture: ComponentFixture<CreateEVFinalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEVFinalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEVFinalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
