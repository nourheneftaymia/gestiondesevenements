import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifierInvitationComponent } from './dialog-modifier-invitation.component';

describe('DialogModifierInvitationComponent', () => {
  let component: DialogModifierInvitationComponent;
  let fixture: ComponentFixture<DialogModifierInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModifierInvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogModifierInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
