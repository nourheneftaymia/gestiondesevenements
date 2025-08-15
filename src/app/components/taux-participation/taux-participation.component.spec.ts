import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauxParticipationComponent } from './taux-participation.component';

describe('TauxParticipationComponent', () => {
  let component: TauxParticipationComponent;
  let fixture: ComponentFixture<TauxParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TauxParticipationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TauxParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
