import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementDetailsDialogComponent } from './evenement-details-dialog.component';

describe('EvenementDetailsDialogComponent', () => {
  let component: EvenementDetailsDialogComponent;
  let fixture: ComponentFixture<EvenementDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenementDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvenementDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
