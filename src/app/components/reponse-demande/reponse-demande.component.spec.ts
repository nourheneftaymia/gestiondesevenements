import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseDemandeComponent } from './reponse-demande.component';

describe('ReponseDemandeComponent', () => {
  let component: ReponseDemandeComponent;
  let fixture: ComponentFixture<ReponseDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReponseDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReponseDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
