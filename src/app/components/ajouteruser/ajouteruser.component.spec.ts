import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteruserComponent } from './ajouteruser.component';

describe('AjouteruserComponent', () => {
  let component: AjouteruserComponent;
  let fixture: ComponentFixture<AjouteruserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouteruserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouteruserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
