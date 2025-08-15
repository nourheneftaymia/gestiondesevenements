import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordSuperieurHeararchiqueComponent } from './dashbord-superieur-heararchique.component';

describe('DashbordSuperieurHeararchiqueComponent', () => {
  let component: DashbordSuperieurHeararchiqueComponent;
  let fixture: ComponentFixture<DashbordSuperieurHeararchiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbordSuperieurHeararchiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordSuperieurHeararchiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
