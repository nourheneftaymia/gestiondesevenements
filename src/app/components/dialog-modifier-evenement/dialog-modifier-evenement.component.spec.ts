import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifierEvenementComponent } from './dialog-modifier-evenement.component';

describe('DialogModifierEvenementComponent', () => {
  let component: DialogModifierEvenementComponent;
  let fixture: ComponentFixture<DialogModifierEvenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModifierEvenementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogModifierEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
