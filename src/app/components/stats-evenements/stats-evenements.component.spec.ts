import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsEvenementsComponent } from './stats-evenements.component';

describe('StatsEvenementsComponent', () => {
  let component: StatsEvenementsComponent;
  let fixture: ComponentFixture<StatsEvenementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsEvenementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsEvenementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
