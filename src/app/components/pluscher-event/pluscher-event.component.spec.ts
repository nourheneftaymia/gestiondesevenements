import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluscherEventComponent } from './pluscher-event.component';

describe('PluscherEventComponent', () => {
  let component: PluscherEventComponent;
  let fixture: ComponentFixture<PluscherEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluscherEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluscherEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
