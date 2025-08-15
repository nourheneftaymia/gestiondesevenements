import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeeventComponent } from './demandeevent.component';

describe('DemandeeventComponent', () => {
  let component: DemandeeventComponent;
  let fixture: ComponentFixture<DemandeeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeeventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
