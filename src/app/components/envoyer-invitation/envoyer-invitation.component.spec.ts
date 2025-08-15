import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerInvitationComponent } from './envoyer-invitation.component';

describe('EnvoyerInvitationComponent', () => {
  let component: EnvoyerInvitationComponent;
  let fixture: ComponentFixture<EnvoyerInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoyerInvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvoyerInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
